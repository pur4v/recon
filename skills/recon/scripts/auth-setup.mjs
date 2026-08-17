#!/usr/bin/env node
// auth-setup.mjs — authenticate ONCE, as yourself, and save the session for headless runs.
//
// Usage:   node skills/recon/scripts/auth-setup.mjs <app-url> [--out .recon/.auth/state.json]
//
// Opens a HEADED browser at <app-url>. You log in with YOUR OWN account (or a sanctioned
// test account) — recon never sees or stores your password; you type it into the real
// login. When you're logged in, come back to the terminal and press Enter. The browser's
// cookies + localStorage are saved as Playwright storageState so every later script runs
// headless without re-login.
//
// AUTHORIZATION: only do this for a product you own or are explicitly authorized to test.
// The saved state is a live credential — it lands in .recon/.auth/ which is gitignored.
// Never commit it, never share it.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
const outFlag = args.indexOf('--out');
const out = resolve(outFlag !== -1 ? args[outFlag + 1] : '.recon/.auth/state.json');

if (!url) {
  console.error('usage: node auth-setup.mjs <app-url> [--out .recon/.auth/state.json]');
  process.exit(1);
}

await mkdir(dirname(out), { recursive: true });

console.log(`\nOpening ${url} in a headed browser.`);
console.log('Log in with YOUR OWN account, then return here and press Enter to save.\n');

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});

// Wait for the human to finish logging in.
await new Promise((res) => {
  process.stdin.resume();
  process.stdin.once('data', () => res());
});

await ctx.storageState({ path: out });
await browser.close();

console.log(`\nSaved session -> ${out}`);
console.log('This file is a live credential. It is gitignored; never commit or share it.\n');
process.exit(0);
