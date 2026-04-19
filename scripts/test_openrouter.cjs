#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

(async function () {
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) {
      console.error('.env not found at', envPath);
      process.exit(1);
    }

    const env = fs.readFileSync(envPath, 'utf8');
    const m = env.match(/^VITE_OPENROUTER_API_KEY=(.+)$/m);
    const key = m ? m[1].trim().replace(/^"|"$/g, '') : null;
    if (!key) {
      console.error('VITE_OPENROUTER_API_KEY not found in .env');
      process.exit(1);
    }

    console.log('Using OpenRouter key prefix:', key.slice(0, 8) + '...');

    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a simple test assistant.' },
        { role: 'user', content: 'Say hello in one short sentence.' }
      ],
      temperature: 0.2,
      max_tokens: 80
    };

    const https = require('https');
    const req = https.request('https://openrouter.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      }
    }, (res) => {
      console.log('HTTP', res.statusCode, res.statusMessage);
      let out = '';
      res.on('data', (d) => out += d);
      res.on('end', () => {
        try { console.log('BODY', JSON.parse(out)); } catch (e) { console.log('BODY', out); }
      });
    });

    req.on('error', (err) => {
      console.error('REQUEST ERROR', err.message);
      process.exit(1);
    });

    req.write(JSON.stringify(payload));
    req.end();

  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
