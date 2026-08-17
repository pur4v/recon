#!/usr/bin/env node
// decode.mjs — recover a web app's hydration/data payloads into plain JSON.
//
// Modern SPAs ship a serialized copy of server state to the browser. It is often more
// complete and more honest than the rendered UI (full route/tool manifests, feature flags,
// plan objects, and the names of backend pipelines a UI otherwise masks). This decodes the
// common frameworks so you can read it.
//
// Usage:
//   node skills/recon/scripts/decode.mjs <url> [--framework auto|sveltekit|next|remix|generic]
//                                              [--auth .recon/.auth/state.json]
//                                              [--out .recon/traces]
//
// Fetches <url> with your authorized session (no rendering), auto-detects the framework,
// decodes, and writes both the raw capture and the decoded JSON to --out.
//
// AUTHORIZATION: owned / authorized target, your own session. Payloads can contain tokens
// and user data — --out lives under .recon (gitignored). Treat it as sensitive.

import { chromium } from 'playwright';
import { unflatten } from 'devalue';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const url = argv.find((a) => !a.startsWith('--'));
const opt = (n, d) => { const i = argv.indexOf(n); return i !== -1 ? argv[i + 1] : d; };
if (!url) {
  console.error('usage: node decode.mjs <url> [--framework auto|sveltekit|next|remix|generic] [--auth f] [--out d]');
  process.exit(1);
}
const framework = opt('--framework', 'auto');
const auth = resolve(opt('--auth', '.recon/.auth/state.json'));
const out = resolve(opt('--out', '.recon/traces'));
await mkdir(out, { recursive: true });
const slug = (url.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_') || 'root').slice(0, 70);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ storageState: auth });

// Deep-parse: many payloads nest JSON as strings. Recursively JSON.parse string values
// that look like objects/arrays so the caller sees structure, not opaque strings.
function deepParse(v, depth = 0) {
  if (depth > 6) return v;
  if (typeof v === 'string') {
    const s = v.trim();
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try { return deepParse(JSON.parse(s), depth + 1); } catch { return v; }
    }
    return v;
  }
  if (Array.isArray(v)) return v.map((x) => deepParse(x, depth + 1));
  if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = deepParse(v[k], depth + 1); return o; }
  return v;
}

// ── SvelteKit: <route>/__data.json — newline-delimited devalue-flattened nodes + streamed
//    promise chunks. Reviver keeps unresolved Promises as their resolved value. ──────────
async function decodeSvelteKit(pageUrl) {
  const u = new URL(pageUrl);
  const dataUrl = u.origin + u.pathname.replace(/\/$/, '') + '/__data.json' + u.search;
  const r = await ctx.request.get(dataUrl, { timeout: 20000 });
  if (!r.ok()) throw new Error(`__data.json HTTP ${r.status()}`);
  const txt = await r.text();
  await writeFile(resolve(out, slug + '.raw.sveltekit.txt'), txt);
  const rev = { Promise: (v) => v };
  const results = [];
  for (const line of txt.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    let node;
    try { node = JSON.parse(t); } catch { continue; }
    // top-level SvelteKit doc: { type:"data", nodes:[ {type:"data", data:[...]}, ... ] }
    const dataNodes = node.nodes ? node.nodes.filter((n) => n && n.type === 'data' && Array.isArray(n.data)) : (node.type === 'data' && Array.isArray(node.data) ? [node] : []);
    for (const n of dataNodes) {
      try { results.push(deepParse(unflatten(n.data, rev))); } catch { /* skip */ }
    }
    if (node.type === 'chunk' && Array.isArray(node.data)) {
      try { results.push(deepParse(unflatten(node.data, rev))); } catch { /* skip */ }
    }
  }
  return { framework: 'sveltekit', source: dataUrl, decoded: results };
}

// ── Next.js: Pages Router __NEXT_DATA__ JSON, or App Router RSC flight lines. ────────────
async function decodeNext(pageUrl) {
  const r = await ctx.request.get(pageUrl, { timeout: 20000 });
  const html = await r.text();
  await writeFile(resolve(out, slug + '.raw.next.html'), html);
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    return { framework: 'next(pages)', source: pageUrl, decoded: deepParse(JSON.parse(m[1])) };
  }
  // App Router: self.__next_f.push([1,"..."]) flight chunks embedded in the HTML.
  const flight = [...html.matchAll(/self\.__next_f\.push\(\[1,\s*("(?:[^"\\]|\\.)*")\]\)/g)]
    .map((x) => { try { return JSON.parse(x[1]); } catch { return ''; } })
    .join('');
  if (flight) {
    const rows = {};
    for (const line of flight.split('\n')) {
      const mm = line.match(/^([0-9a-f]+):(.*)$/);
      if (!mm) continue;
      let val = mm[2];
      const j = val.replace(/^[A-Z]/, ''); // some rows are prefixed with a type letter
      try { val = JSON.parse(j); } catch { /* keep string */ }
      rows[mm[1]] = deepParse(val);
    }
    return { framework: 'next(app/rsc)', source: pageUrl, decoded: rows };
  }
  throw new Error('no __NEXT_DATA__ or RSC flight found');
}

// ── Remix: window.__remixContext hydration blob. ────────────────────────────────────────
async function decodeRemix(pageUrl) {
  const page = await ctx.newPage();
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);
  const data = await page.evaluate(() => window.__remixContext ?? null);
  await page.close();
  if (!data) throw new Error('window.__remixContext not present');
  await writeFile(resolve(out, slug + '.raw.remix.json'), JSON.stringify(data));
  return { framework: 'remix', source: pageUrl, decoded: deepParse(data) };
}

// ── Generic: dump inline JSON <script> blobs + note it's a fallback. ─────────────────────
async function decodeGeneric(pageUrl) {
  const r = await ctx.request.get(pageUrl, { timeout: 20000 });
  const html = await r.text();
  await writeFile(resolve(out, slug + '.raw.generic.html'), html);
  const blobs = [];
  for (const m of html.matchAll(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { blobs.push(deepParse(JSON.parse(m[1]))); } catch { /* skip */ }
  }
  return { framework: 'generic', source: pageUrl, note: 'fallback: inline application/json blobs only. Also inspect XHR/fetch traffic.', decoded: blobs };
}

async function detect(pageUrl) {
  const r = await ctx.request.get(pageUrl, { timeout: 20000 }).catch(() => null);
  const html = r ? await r.text() : '';
  const headers = r ? r.headers() : {};
  if (/__NEXT_DATA__|\/_next\/|self\.__next_f/.test(html)) return 'next';
  if (/__remixContext/.test(html)) return 'remix';
  if (/__sveltekit_|\bsveltekit\b|data-sveltekit/.test(html) || (headers['x-sveltekit-page'])) return 'sveltekit';
  return 'generic';
}

const handlers = { sveltekit: decodeSvelteKit, next: decodeNext, remix: decodeRemix, generic: decodeGeneric };

try {
  const fw = framework === 'auto' ? await detect(url) : framework;
  console.log(`framework: ${fw}${framework === 'auto' ? ' (auto-detected)' : ''}`);
  let result;
  try {
    result = await handlers[fw](url);
  } catch (e) {
    console.log(`  ${fw} decode failed (${e.message}); falling back to generic`);
    result = await decodeGeneric(url);
  }
  const outfile = resolve(out, slug + '.decoded.json');
  await writeFile(outfile, JSON.stringify(result.decoded, null, 2));
  const n = Array.isArray(result.decoded) ? result.decoded.length : Object.keys(result.decoded || {}).length;
  console.log(`decoded ${n} node(s) from ${result.framework}`);
  console.log(`  raw     -> ${out}/${slug}.raw.*`);
  console.log(`  decoded -> ${outfile}`);
  console.log('\nReminder: payloads may contain tokens/user data. .recon is gitignored — keep it that way.');
} finally {
  await ctx.close();
  await browser.close();
}
