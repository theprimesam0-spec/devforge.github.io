#!/usr/bin/env node
/*
  scripts/generate_knowledge.cjs
  - Ingests an input JSON array (default: src/data/knowledge_base.json)
  - Produces an output JSON array with a target number of entries (default: 25000)
  - Strategy: split long `response` fields into sentence chunks, pair with keywords,
    and duplicate/augment if needed to reach the target count.

  Usage:
    node scripts/generate_knowledge.cjs [input.json] [output.json] [targetCount]

  Example:
    node scripts/generate_knowledge.cjs src/data/knowledge_base.json src/data/knowledge_base_25k.json 25000
*/

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const inputPath = args[0] || path.join('src','data','knowledge_base.json');
const outputPath = args[1] || path.join('src','data','knowledge_base_25k.json');
const targetCount = parseInt(args[2], 10) || 25000;

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Failed to read or parse', file, e.message || e);
    process.exit(1);
  }
}

if (!fs.existsSync(inputPath)) {
  console.error('Input file not found:', inputPath);
  process.exit(1);
}

const source = readJSON(inputPath);
if (!Array.isArray(source)) {
  console.error('Input JSON must be an array of knowledge objects.');
  process.exit(1);
}

function splitToSentences(text) {
  if (!text || typeof text !== 'string') return [''];
  // crude sentence splitter: keep punctuation with sentences
  const matches = text.match(/[^.!?]+[.!?]*/g);
  if (!matches) return [text.trim()];
  return matches.map(s => s.trim()).filter(Boolean);
}

function chunkSentences(sentences, chunkSize = 3) {
  const chunks = [];
  for (let i = 0; i < sentences.length; i += chunkSize) {
    chunks.push(sentences.slice(i, i + chunkSize).join(' ').trim());
  }
  return chunks.length ? chunks : [''];
}

function ensureKeywords(item) {
  if (Array.isArray(item.keywords) && item.keywords.length) return item.keywords;
  if (item.title && typeof item.title === 'string') return [item.title];
  if (item.response && typeof item.response === 'string') {
    return item.response.split(/\s+/).slice(0,3).join(' ')
      ? [item.response.split(/\s+/).slice(0,3).join(' ')]
      : ['general'];
  }
  return ['general'];
}

const out = [];
let idCounter = 1;
function makeId() { return 'kb-' + String(idCounter++).padStart(6,'0'); }

// Build entries by chunking responses and pairing with keywords.
for (const item of source) {
  if (out.length >= targetCount) break;
  const keywords = ensureKeywords(item);
  const sentences = splitToSentences(item.response || '');
  const chunks = chunkSentences(sentences, 3);

  for (const chunk of chunks) {
    for (const kw of keywords) {
      if (out.length >= targetCount) break;
      out.push({ id: makeId(), keywords: [kw], response: chunk || (item.response || '').slice(0,400) });
    }
    if (out.length >= targetCount) break;
  }
}

// If we still don't have enough entries, duplicate with small augmentations.
if (out.length === 0) {
  // fallback: create empty skeletons
  out.push({ id: makeId(), keywords: ['general'], response: 'No knowledge available.' });
}

let dupIndex = 0;
while (out.length < targetCount) {
  const src = out[dupIndex % out.length];
  const copy = {
    id: makeId(),
    keywords: src.keywords,
    response: src.response + ` (augmented ${Math.floor(dupIndex / out.length) + 1})`
  };
  out.push(copy);
  dupIndex++;
  // safety: prevent infinite loop
  if (dupIndex > targetCount * 5) break;
}

// Write JSON array to outputPath
try {
  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', out.length, 'entries to', outputPath);
} catch (e) {
  console.error('Failed to write output file:', e.message || e);
  process.exit(1);
}

// Also write a JSONL version (one JSON object per line) next to it for streaming ingestion tools.
try {
  const jsonlPath = outputPath.replace(/\.json$/i, '.jsonl');
  const ws = fs.createWriteStream(jsonlPath, { encoding: 'utf8' });
  for (const obj of out) ws.write(JSON.stringify(obj) + '\n');
  ws.end();
  console.log('Wrote JSONL version to', jsonlPath);
} catch (e) {
  console.error('Failed to write JSONL:', e.message || e);
}
