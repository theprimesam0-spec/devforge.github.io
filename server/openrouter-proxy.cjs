#!/usr/bin/env node
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

let OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// Development convenience: fall back to VITE_OPENROUTER_API_KEY in .env if present
try {
  if (!OPENROUTER_API_KEY) {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, 'utf8');
      const m = env.match(/^VITE_OPENROUTER_API_KEY=(.+)$/m);
      if (m) OPENROUTER_API_KEY = m[1].trim().replace(/^"|"$/g, '');
    }
  }
} catch (e) {
  // ignore
}

const PORT = process.env.PORT || 5178;

function proxyToOpenRouter(bodyObj, clientRes) {
  const bodyStr = JSON.stringify(bodyObj);
  const req = https.request('https://api.openrouter.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Length': Buffer.byteLength(bodyStr),
    },
  }, (res) => {
    clientRes.writeHead(res.statusCode || 200, { 'Content-Type': res.headers['content-type'] || 'application/json' });
    res.pipe(clientRes);
  });

  req.on('error', (err) => {
    clientRes.writeHead(502, { 'Content-Type': 'application/json' });
    clientRes.end(JSON.stringify({ error: err.message }));
  });

  req.write(bodyStr);
  req.end();
}

const server = http.createServer((req, res) => {
  // Basic CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/openrouter') {
    if (!OPENROUTER_API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY not configured on server' }));
      return;
    }

    let body = '';
    req.on('data', (chunk) => body += chunk);
    req.on('end', () => {
      try {
        const obj = JSON.parse(body || '{}');
        proxyToOpenRouter(obj, res);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid JSON' }));
      }
    });

    req.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, () => {
  console.log(`OpenRouter proxy listening on http://localhost:${PORT}/api/openrouter`);
  if (!OPENROUTER_API_KEY) {
    console.warn('Warning: OPENROUTER_API_KEY not set. Set it as an env var for production. Falling back to VITE_OPENROUTER_API_KEY from .env only for local dev.');
  }
});
