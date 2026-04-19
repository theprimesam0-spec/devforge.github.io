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

    console.log('Using Gemini key prefix:', key.slice(0,8)+'...');

    const model = 'models/gemini-2.5-flash';
    const payload = JSON.stringify({
      system_instruction: { parts: { text: 'You are a simple test assistant.' } },
      contents: [ { role: 'user', parts: [{ text: 'Say hello in one short sentence.' }] } ]
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } }, res => {
      console.log('STATUS', res.statusCode);
      let out = '';
      res.on('data', d => out += d);
      res.on('end', () => {
        try { console.log('BODY', JSON.parse(out)); } catch (e) { console.log('BODY RAW', out); }
      });
    });

    req.on('error', err => { console.error('REQUEST ERROR', err.message); process.exit(1); });
    req.write(payload);
    req.end();

  } catch (e) { console.error('ERR', e && e.message ? e.message : e); process.exit(1); }
})();
