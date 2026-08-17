#!/usr/bin/env node
// capture.mjs — headless crawl of an authorized product: DOM outline + network + screenshots.
//
// Usage:
//   node skills/recon/scripts/capture.mjs <routes.txt|url,url,...> [options]
//
//   <routes>            path to a newline-delimited file of routes/URLs, OR a comma-list.
//                       Relative routes are resolved against --base.
// Options:
//   --base <url>        base origin for relative routes (default: origin of first abs URL)
//   --auth <file>       storageState from auth-setup.mjs (default: .recon/.auth/state.json)
//   --out  <dir>        output dir (default: .recon)
//   --settle <ms>       wait after domcontentloaded (default: 2500) — NOT networkidle
//   --no-shots          skip screenshots
//   --no-har            skip HAR recording (HAR feeds Spec mode's Data contract)
//
// Writes: <out>/screens.json (DOM outline + captured network per screen)
//         <out>/shots/<label>.png
//         <out>/traces/<label>/network.har  (full request/response — Spec Data contract)
// READ-ONLY: navigates and screenshots only. It clicks nothing. Never spends quota.
//
// AUTHORIZATION: owned / authorized target, your own session. Traces may contain tokens —
// the whole <out> dir (.recon) is gitignored; treat it as sensitive.

import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const argv = process.argv.slice(2);
const pos = argv.find((a) => !a.startsWith('--'));
const opt = (name, dflt) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(name);

if (!pos) {
  console.error('usage: node capture.mjs <routes.txt|url,url,...> [--base url] [--auth f] [--out d] [--settle ms] [--no-shots]');
  process.exit(1);
}

const auth = resolve(opt('--auth', '.recon/.auth/state.json'));
const out = resolve(opt('--out', '.recon'));
const shotsDir = resolve(out, 'shots');
const tracesDir = resolve(out, 'traces');
const settle = parseInt(opt('--settle', '2500'), 10);
const wantShots = !has('--no-shots');
const wantHar = !has('--no-har');

// Resolve the route list (file or comma-list).
let raw;
try {
  raw = await readFile(resolve(pos), 'utf8');
} catch {
  raw = pos.split(',').join('\n');
}
let routes = raw.split('\n').map((s) => s.trim()).filter(Boolean);

const firstAbs = routes.find((r) => /^https?:\/\//.test(r));
const base = opt('--base', firstAbs ? new URL(firstAbs).origin : '');
const toUrl = (r) => (/^https?:\/\//.test(r) ? r : base.replace(/\/$/, '') + (r.startsWith('/') ? r : '/' + r));

await mkdir(shotsDir, { recursive: true });
if (wantHar) await mkdir(tracesDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const report = [];
for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const url = toUrl(route);
  const label = (route.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_') || 'root').slice(0, 60);
  const rec = { route, url, label, net: [], har: null };

  // One context per screen so its HAR (full request/response — the Data contract source)
  // is cleanly attributed. HAR content is embedded; the whole .recon dir is gitignored.
  const harPath = resolve(tracesDir, label, 'network.har');
  if (wantHar) await mkdir(resolve(tracesDir, label), { recursive: true });
  const ctx = await browser.newContext({
    storageState: auth,
    viewport: { width: 1440, height: 1000 },
    ...(wantHar ? { recordHar: { path: harPath, content: 'embed' } } : {}),
  });
  const page = await ctx.newPage();

  // Also keep a compact network summary (method/url/status/type) in screens.json.
  const onResp = (resp) => {
    try {
      const r = resp.request();
      rec.net.push({ method: r.method(), url: resp.url().slice(0, 300), status: resp.status(), type: resp.headers()['content-type'] || '' });
    } catch { /* ignore */ }
  };
  page.on('response', onResp);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(settle); // deliberately NOT networkidle: live apps never idle
    rec.finalUrl = new URL(page.url()).pathname;
    rec.title = await page.title();
    rec.headings = await page.$$eval('h1,h2,h3', (els) => [...new Set(els.map((e) => e.textContent.trim()).filter(Boolean))].slice(0, 15));
    rec.navLinks = await page.$$eval('a[href^="/"]', (els) => [...new Set(els.map((e) => e.getAttribute('href')))].slice(0, 50));
    rec.buttons = await page.$$eval('button,[role="menuitem"]', (els) => [...new Set(els.map((e) => (e.getAttribute('aria-label') || e.textContent || '').trim()).filter((t) => t && t.length < 40))].slice(0, 50));
    rec.tabs = await page.$$eval('[role="tab"]', (els) => els.map((e) => e.textContent.trim()).filter(Boolean).slice(0, 25));
    rec.inputs = await page.$$eval('input,textarea,select', (els) => els.map((e) => ({ t: e.tagName.toLowerCase(), type: e.type || '', ph: e.placeholder || '', name: e.name || '' })).slice(0, 40));
    if (wantShots) await page.screenshot({ path: resolve(shotsDir, label + '.png'), fullPage: false });
    if (wantHar) rec.har = harPath;
    console.log(`(${i + 1}/${routes.length}) ${label.padEnd(40)} "${rec.title || ''}" h=${rec.headings?.length || 0} btn=${rec.buttons?.length || 0} tab=${rec.tabs?.length || 0}`);
  } catch (e) {
    rec.error = e.message;
    console.log(`(${i + 1}/${routes.length}) ${label} ERR ${e.message}`);
  } finally {
    page.off('response', onResp);
    await ctx.close(); // flushes the HAR to disk
  }
  report.push(rec);
}

await writeFile(resolve(out, 'screens.json'), JSON.stringify(report, null, 2));
console.log(`\nDONE -> ${resolve(out, 'screens.json')}  (${report.length} screens, shots in ${shotsDir}${wantHar ? `, HARs in ${tracesDir}` : ''})`);
await browser.close();
