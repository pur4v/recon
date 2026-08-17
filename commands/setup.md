---
description: Set up authorized capture for recon — log in once with your own account and save the session for headless runs.
argument-hint: [app URL to authenticate against, e.g. https://app.example.com]
---

Set up **recon** capture against: $ARGUMENTS

First confirm authorization: the target must be a product you **own or are explicitly
authorized to test**. If that isn't true, stop.

Run `node skills/recon/scripts/auth-setup.mjs $ARGUMENTS`. This opens a headed browser; the
user logs in with **their own** account (recon never handles the password), then presses
Enter to save the session `storageState` to `.recon/.auth/state.json`.

That file is a live credential — it is gitignored; never commit or share it. All later
recon runs are headless and reuse it. See `skills/recon/reference/playwright.md`.
