#!/usr/bin/env node
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { URL } = require('url');
const https = require('https');
const http = require('http');

const [, , siteUrl, outDirArg] = process.argv;
if (!siteUrl) {
  console.error('Usage: node scripts/backup_deployed_site.js <siteUrl> [outDir]');
  process.exit(1);
}

const outDir = outDirArg || `./devforge-backup-${new Date().toISOString().slice(0, 10)}`;

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function sanitizeFilename(name) {
  return name.replace(/[\\\/:*?"<>|]/g, '_');
}

async function downloadTo(urlStr, filepath) {
  await ensureDir(path.dirname(filepath));
  const parsed = new URL(urlStr);
  const lib = parsed.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.get(parsed, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirect
        const redirect = new URL(res.headers.location, parsed).toString();
        downloadTo(redirect, filepath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${urlStr} - status ${res.statusCode}`);
        resolve(false);
        return;
      }
      const stream = fsSync.createWriteStream(filepath);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
      stream.on('error', (err) => reject(err));
    });
    req.on('error', reject);
  });
}

function extractResources(html) {
  const urls = new Set();
  const attrRegex = /(?:src|href)=["']([^"']+)["']/ig;
  let match;
  while ((match = attrRegex.exec(html)) !== null) {
    const url = match[1];
    if (!url) continue;
    if (url.startsWith('data:')) continue;
    if (url.startsWith('javascript:')) continue;
    urls.add(url);
  }
  return Array.from(urls);
}

(async () => {
  console.log('Backing up', siteUrl, '->', outDir);
  await ensureDir(outDir);
  const base = new URL(siteUrl);
  const mainRes = await fetch(siteUrl);
  if (!mainRes.ok) {
    console.error('Failed to fetch main page', mainRes.status);
    process.exit(1);
  }
  const html = await mainRes.text();
  await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8');

  const resources = extractResources(html);
  console.log(`Found ${resources.length} referenced resources`);

  const absoluteResources = resources.map(r => {
    try {
      return new URL(r, base).toString();
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  // add some common extras
  const extras = ['favicon.ico', 'manifest.json', '/favicon-32x32.png', '/favicon-16x16.png', '/site.webmanifest'];
  extras.forEach(e => {
    try {
      absoluteResources.push(new URL(e, base).toString());
    } catch (e) {}
  });

  const unique = Array.from(new Set(absoluteResources));

  const downloads = unique.map(u => {
    const urlObj = new URL(u);
    const rel = urlObj.pathname + (urlObj.search || '');
    const safeRel = sanitizeFilename(rel);
    const filePath = path.join(outDir, urlObj.hostname, safeRel.replace(/^\/+/, ''));
    return { url: u, filePath };
  });

  for (const d of downloads) {
    console.log('Downloading', d.url);
    try {
      await downloadTo(d.url, d.filePath);
    } catch (e) {
      console.error('Error downloading', d.url, (e && e.message) || e);
    }
  }

  console.log('Backup complete at', outDir);
})();
