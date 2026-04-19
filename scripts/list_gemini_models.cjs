#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

(async () => {
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
      console.error('.env not found');
      process.exit(1);
    }
    const env = fs.readFileSync(envPath, 'utf8');
    const m = env.match(/^VITE_GEMINI_API_KEY=(.+)$/m);
    const key = m ? m[1].trim().replace(/^"|"$/g, '') : null;
    if (!key) {
      console.error('VITE_GEMINI_API_KEY not found in .env');
      process.exit(1);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    https.get(url, (res) => {
      console.log('STATUS', res.statusCode);
      let out = '';
      res.on('data', (d) => out += d);
      res.on('end', () => {
        try { console.log('BODY', JSON.stringify(JSON.parse(out), null, 2).slice(0, 20000)); } catch (e) { console.log('BODY RAW', out); }
      });
    }).on('error', (err) => {
      console.error('REQUEST ERROR', err.message);
    });
  } catch (e) { console.error('ERR', e && e.message ? e.message : e); process.exit(1); }
})();
