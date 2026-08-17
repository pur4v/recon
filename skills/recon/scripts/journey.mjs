#!/usr/bin/env node
// journey.mjs — record a VIDEO walkthrough of a user journey (+ storyboard shots + HAR).
//
// capture.mjs is read-only page-loads; journey.mjs walks an ORDERED path with the clicks
// that advance it, recording ONE video for the whole walk (the "playwright video of the
// user journey") plus a screenshot after every step (the storyboard) and a HAR for the
// data contract of the flow.
//
// Usage:
//   node skills/recon/scripts/journey.mjs <steps.txt> --base https://app.example.com [options]
//
// steps.txt — one step per line, in order:
//   /route                or  https://...     → navigate (goto)
//   click: <selector>                          → click (advances the journey)
//   wait:  <ms>                                → settle
//   shot:  <label>                             → screenshot now (auto-shot after each step too)
//   note:  <text>                              → annotate the storyboard (no action)
//   fill:  <selector> = <value>                → type into a field (REQUIRES --allow-input)
//   press: <key>                               → keyboard key, e.g. Enter (REQUIRES --allow-input)
//   # comment / blank                          → ignored
//
// Options:
//   --base <url>     origin for relative routes            --auth <file>  storageState (default .recon/.auth/state.json)
//   --out <dir>      output dir (default .recon)           --settle <ms>  default wait after each step (default 1200)
//   --name <slug>    journey name (default "journey")       --allow-input  permit fill:/press: steps (may mutate — see below)
//   --no-har         skip HAR
//
// Writes: <out>/videos/<name>/*.webm  ·  <out>/shots/journey/<name>-NN-<label>.png
//         <out>/traces/<name>/network.har  ·  <out>/journeys/<name>.steps.json (the storyboard)
//
// READ-ONLY BY DEFAULT: navigate + click only. fill:/press: are gated behind --allow-input
// because typing + submitting can create data or spend credits. Only list non-destructive
// steps; do NOT click "Delete", "Send", "Buy", or anything that spends quota without per-run
// authorization. AUTHORIZATION: owned/authorized target, your own session. .recon is gitignored.

import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const pos = argv.find((a) => !a.startsWith('--'));
const opt = (name, dflt) => { const i = argv.indexOf(name); return i !== -1 ? argv[i + 1] : dflt; };
const has = (name) => argv.includes(name);

if (!pos) {
  console.error('usage: node journey.mjs <steps.txt> --base <url> [--name slug] [--allow-input]');
  process.exit(1);
}

const auth = resolve(opt('--auth', '.recon/.auth/state.json'));
const out = resolve(opt('--out', '.recon'));
const name = (opt('--name', 'journey')).replace(/[^\w.-]+/g, '_');
const settle = parseInt(opt('--settle', '1200'), 10);
const wantHar = !has('--no-har');
const allowInput = has('--allow-input');
const base = (opt('--base', '') || '').replace(/\/$/, '');
const toUrl = (r) => (/^https?:\/\//.test(r) ? r : base + (r.startsWith('/') ? r : '/' + r));

const raw = await readFile(resolve(pos), 'utf8');
const steps = raw.split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));

const shotsDir = resolve(out, 'shots', 'journey');
const videosDir = resolve(out, 'videos', name);
const tracesDir = resolve(out, 'traces', name);
await mkdir(shotsDir, { recursive: true });
await mkdir(videosDir, { recursive: true });
if (wantHar) await mkdir(tracesDir, { recursive: true });
await mkdir(resolve(out, 'journeys'), { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  storageState: auth,
  viewport: { width: 1440, height: 1000 },
  recordVideo: { dir: videosDir, size: { width: 1440, height: 900 } },
  ...(wantHar ? { recordHar: { path: resolve(tracesDir, 'network.har'), content: 'embed' } } : {}),
});
const page = await ctx.newPage();

const board = []; // the storyboard: one entry per step
const net = [];
page.on('response', (resp) => { try { const r = resp.request(); net.push({ method: r.method(), url: resp.url().slice(0, 200), status: resp.status() }); } catch {} });

const shot = async (n, label) => {
  const file = resolve(shotsDir, `${name}-${String(n).padStart(2, '0')}-${(label || 'step').replace(/[^\w.-]+/g, '_').slice(0, 40)}.png`);
  try { await page.screenshot({ path: file }); } catch {}
  return file;
};

let n = 0;
for (const line of steps) {
  n++;
  const [kwRaw, ...restArr] = line.split(':');
  const kw = kwRaw.trim().toLowerCase();
  const rest = restArr.join(':').trim();
  const entry = { step: n, line, netBefore: net.length };
  try {
    if (kw === 'click') { await page.click(rest, { timeout: 8000 }); entry.action = `click ${rest}`; }
    else if (kw === 'wait') { await page.waitForTimeout(parseInt(rest, 10) || settle); entry.action = `wait ${rest}ms`; }
    else if (kw === 'note') { entry.action = `note: ${rest}`; }
    else if (kw === 'shot') { entry.action = `shot ${rest}`; }
    else if (kw === 'fill') {
      if (!allowInput) throw new Error('fill: needs --allow-input (may create data)');
      const [sel, ...v] = rest.split('='); await page.fill(sel.trim(), v.join('=').trim()); entry.action = `fill ${sel.trim()}`;
    } else if (kw === 'press') {
      if (!allowInput) throw new Error('press: needs --allow-input (may submit/mutate)');
      await page.keyboard.press(rest); entry.action = `press ${rest}`;
    } else { // a route / url
      await page.goto(toUrl(line), { waitUntil: 'domcontentloaded', timeout: 30000 }); entry.action = `goto ${line}`;
    }
    if (kw !== 'wait' && kw !== 'note') await page.waitForTimeout(settle);
    entry.url = page.url();
    entry.title = await page.title().catch(() => '');
    entry.shot = await shot(n, kw === 'note' ? rest.slice(0, 20) : (rest || line));
    entry.netFired = net.length - entry.netBefore; // how many requests this step triggered
    console.log(`(${n}/${steps.length}) ${entry.action.padEnd(38)} -> ${entry.url}  (+${entry.netFired} req)`);
  } catch (e) {
    entry.error = e.message;
    console.log(`(${n}/${steps.length}) ${line}  ERR ${e.message}`);
  }
  board.push(entry);
}

// Flush video + HAR, then record where the video landed.
await page.close();
await ctx.close();
await browser.close();

await writeFile(resolve(out, 'journeys', `${name}.steps.json`), JSON.stringify({ name, base, steps: board, net }, null, 2));
console.log(`\nDONE -> journey "${name}"  (${board.length} steps)  video in ${videosDir}  storyboard in ${shotsDir}`);
