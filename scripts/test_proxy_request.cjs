#!/usr/bin/env node
const http = require('http');

const payload = JSON.stringify({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Test assistant.' },
    { role: 'user', content: 'Please reply with a short acknowledgement.' }
  ],
  temperature: 0.2,
  max_tokens: 80
});

const req = http.request({
  hostname: 'localhost',
  port: 5178,
  path: '/api/openrouter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  }
}, (res) => {
  console.log('STATUS', res.statusCode);
  let out = '';
  res.on('data', (d) => out += d);
  res.on('end', () => {
    try {
      const j = JSON.parse(out);
      console.log('RESPONSE JSON:', JSON.stringify(j, null, 2).slice(0, 10000));
    } catch (e) {
      console.log('RESPONSE RAW (first 10000 chars):', out.slice(0, 10000));
    }
  });
});

req.on('error', (err) => {
  console.error('REQUEST ERROR', err.message);
});

req.write(payload);
req.end();
