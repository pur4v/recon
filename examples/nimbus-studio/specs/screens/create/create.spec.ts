/**
 * FICTIONAL worked example. See ../../../README.md.
 * recon SCREEN test for `create` — asserts OBSERVED behavior, read-only, own session.
 * Run:  npx playwright test .recon/specs/screens/create/create.spec.ts
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.RECON_BASE ?? 'https://studio.nimbus.example';
const ROUTE = '/create';

test.use({ storageState: '.recon/.auth/state.json' });

test.describe('Create — observed behavior', () => {
  test('loads and renders the tool grid + spark balance', async ({ page }) => {
    await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByText(/sparks/i)).toBeVisible();
  });

  test('fires the documented load requests', async ({ page }) => {
    const [dataReq] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('/create/__data.json')),
      page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded' }),
    ]);
    const res = await dataReq.response();
    expect(res?.status()).toBe(200);
  });

  test('unauthed visit redirects to OAuth (auth gate)', async ({ browser }) => {
    const anon = await browser.newContext(); // no storageState
    const page = await anon.newPage();
    await page.goto(BASE + ROUTE, { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(/\/create$/);
    await anon.close();
  });

  // NOT automated: running a tool at 0 sparks (would need a real render / spend). See test-cases.md.
});
