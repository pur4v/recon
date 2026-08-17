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
//   --video             record a short video of each screen's load (off by default)
//   --mobile            also screenshot a 390px viewport (responsive/breakpoint evidence)
//
// Writes: <out>/screens.json (DOM outline + network + design tokens + copy + analytics beacons)
//         <out>/shots/<label>.png                 (+ <label>@mobile.png with --mobile)
//         <out>/traces/<label>/network.har        (full request/response — Spec Data contract)
//         <out>/videos/<label>/*.webm             (with --video)
// READ-ONLY: navigates and screenshots only. It clicks nothing. Never spends quota.
// (For a walkthrough VIDEO with interactions, use journey.mjs — a guarded, ordered walk.)
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
const videosDir = resolve(out, 'videos');
const settle = parseInt(opt('--settle', '2500'), 10);
const wantShots = !has('--no-shots');
const wantHar = !has('--no-har');
const wantVideo = has('--video');
const wantMobile = has('--mobile');

// Analytics/telemetry beacons — knowing WHAT the product tracks (and which action fires it)
// is a first-class product signal. Matched against the network summary, never spoofed.
const ANALYTICS = [
  ['Segment', /api\.segment\.(io|com)|cdn\.segment/i],
  ['Amplitude', /amplitude\.com|api\d?\.amplitude/i],
  ['Mixpanel', /mixpanel\.com/i],
  ['PostHog', /posthog\.com|\/i\/v0\/e\//i],
  ['Google Analytics', /google-analytics\.com|\/g\/collect|googletagmanager\.com/i],
  ['Rudderstack', /rudderstack|rudderlabs/i],
  ['Heap', /heap(analytics)?\.com/i],
  ['Sentry', /sentry\.io|ingest\.sentry/i],
  ['Hotjar', /hotjar\.com/i],
  ['Intercom', /intercom\.io|intercomcdn/i],
];
const beaconOf = (url) => { const m = ANALYTICS.find(([, re]) => re.test(url)); return m ? m[0] : null; };

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
if (wantVideo) await mkdir(videosDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const report = [];
for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const url = toUrl(route);
  const label = (route.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_') || 'root').slice(0, 60);
  const rec = { route, url, label, net: [], analytics: [], har: null };

  // One context per screen so its HAR (full request/response — the Data contract source)
  // is cleanly attributed. HAR content is embedded; the whole .recon dir is gitignored.
  const harPath = resolve(tracesDir, label, 'network.har');
  if (wantHar) await mkdir(resolve(tracesDir, label), { recursive: true });
  const ctx = await browser.newContext({
    storageState: auth,
    viewport: { width: 1440, height: 1000 },
    ...(wantHar ? { recordHar: { path: harPath, content: 'embed' } } : {}),
    ...(wantVideo ? { recordVideo: { dir: resolve(videosDir, label), size: { width: 1440, height: 900 } } } : {}),
  });
  const page = await ctx.newPage();

  // Also keep a compact network summary (method/url/status/type) in screens.json,
  // and flag analytics/telemetry beacons — what the product tracks on this screen.
  const onResp = (resp) => {
    try {
      const r = resp.request();
      const url = resp.url();
      rec.net.push({ method: r.method(), url: url.slice(0, 300), status: resp.status(), type: resp.headers()['content-type'] || '' });
      const provider = beaconOf(url);
      if (provider) rec.analytics.push({ provider, method: r.method(), url: url.slice(0, 200) });
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

    // Copy inventory — the exact words (you can't rebuild a product without its microcopy).
    rec.copy = await page.evaluate(() => {
      const txt = (sel, n) => [...new Set([...document.querySelectorAll(sel)].map((e) => (e.textContent || '').trim()).filter((t) => t && t.length < 160))].slice(0, n);
      return {
        ctas: txt('button,a[role="button"],[type="submit"]', 30),
        labels: txt('label', 20),
        alerts: txt('[role="alert"],[role="status"],.toast,.error,.empty-state', 15),
      };
    });

    // Design tokens — observed visual system (behavioral, NOT copying their assets).
    rec.design = await page.evaluate(() => {
      const cs = (el) => (el ? getComputedStyle(el) : null);
      const btn = document.querySelector('button,[type="submit"],a[role="button"]');
      const link = document.querySelector('a[href]');
      const h = document.querySelector('h1,h2');
      const b = cs(document.body); const bs = cs(btn); const ls = cs(link); const hs = cs(h);
      return {
        bodyFont: b?.fontFamily || '', bodyBg: b?.backgroundColor || '', bodyColor: b?.color || '',
        headingFont: hs?.fontFamily || '',
        buttonBg: bs?.backgroundColor || '', buttonColor: bs?.color || '', buttonRadius: bs?.borderRadius || '',
        linkColor: ls?.color || '',
      };
    });

    if (wantShots) await page.screenshot({ path: resolve(shotsDir, label + '.png'), fullPage: false });
    if (wantMobile) { await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(400); if (wantShots) await page.screenshot({ path: resolve(shotsDir, label + '@mobile.png'), fullPage: false }); }
    if (wantHar) rec.har = harPath;
    console.log(`(${i + 1}/${routes.length}) ${label.padEnd(40)} "${rec.title || ''}" h=${rec.headings?.length || 0} btn=${rec.buttons?.length || 0} tab=${rec.tabs?.length || 0} beacon=${rec.analytics.length}`);
  } catch (e) {
    rec.error = e.message;
    console.log(`(${i + 1}/${routes.length}) ${label} ERR ${e.message}`);
  } finally {
    page.off('response', onResp);
    if (wantVideo) { try { rec.video = await page.video()?.path(); } catch { /* ignore */ } }
    await ctx.close(); // flushes the HAR (and video) to disk
  }
  report.push(rec);
}

await writeFile(resolve(out, 'screens.json'), JSON.stringify(report, null, 2));
console.log(`\nDONE -> ${resolve(out, 'screens.json')}  (${report.length} screens, shots in ${shotsDir}${wantHar ? `, HARs in ${tracesDir}` : ''}${wantVideo ? `, videos in ${videosDir}` : ''})`);
await browser.close();
