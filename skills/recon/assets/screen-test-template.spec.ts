/**
 * recon SCREEN test (executable). One per screen: .recon/specs/screens/<slug>/<slug>.spec.ts
 *
 * These assert the OBSERVED behavior captured in screen.md — they are read-only reconnaissance
 * checks, not a rebuild's test suite. Discipline still applies:
 *   - Use YOUR OWN authed session via storageState (.recon/.auth/state.json). Never bypass auth.
 *   - READ-ONLY: no real form submits, no created leads, no spent credits/quota.
 *   - Assert against the Data contract in screen.md; reference the shared _api.md.
 *
 * Run:  npx playwright test .recon/specs/screens/<slug>/<slug>.spec.ts
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.RECON_BASE ?? 'https://app.example.com';
const ROUTE = '/route'; // ← the screen's route from screen.md

// Authed screens: point Playwright at your saved session.
// test.use({ storageState: '.recon/.auth/state.json' });

test.describe('<Screen name> — observed behavior', () => {
  test('loads and renders the documented shell', async ({ page }) => {
    await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded' });
    // settle without networkidle (live apps never idle):
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(new RegExp(ROUTE.replace(/\//g, '\\/')));
    // Assert a documented region/component is present (from screen.md → Components):
    // await expect(page.getByRole('button', { name: '<label>' })).toBeVisible();
  });

  test('fires the documented data-contract request(s) on load', async ({ page }) => {
    // Assert the XHR from screen.md → Data contract actually fires.
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('/api/') && r.method() === 'GET'),
      page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded' }),
    ]);
    expect(req.url()).toContain('/api/');
    // const res = await req.response();
    // expect(res?.status()).toBe(200);
  });

  // Add one read-only test per documented state you could safely trigger
  // (empty / loading / auth-gated / paywall). Do NOT force server errors or spend quota.
});
