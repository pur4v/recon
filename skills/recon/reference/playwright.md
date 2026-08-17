# Reference: Playwright capture engine

Playwright is how recon touches the live product. It runs **headless** (no browser popups),
reuses **your** authenticated session, and captures the DOM outline, network traffic, and
screenshots that back every claim. The scripts in `scripts/` implement the patterns below;
this file explains them so you can adapt.

## Setup: authenticate once, as yourself

1. `node scripts/auth-setup.mjs https://app.example.com` opens a **headed** browser. You log
   in with **your own** account (or a sanctioned test account) — recon never handles or
   stores your password; the browser does the login, you do the typing.
2. On close it saves `storageState` (cookies + localStorage) to `.recon/.auth/state.json`.
3. Every later script runs **headless** with `browser.newContext({ storageState })`. No
   re-login, no popups, no credential handling in code.

`.recon/.auth/` is **gitignored**. Never commit it. Treat it like a password.

## Capture patterns

- **Headless everywhere after setup.** `chromium.launch({ headless: true })`.
- **Don't wait for `networkidle` on live apps.** Products with websockets/polling (realtime
  generation, chat, presence) never go idle — `networkidle` will time out. Use
  `waitUntil: 'domcontentloaded'` plus a short explicit settle (`waitForTimeout`) or a
  `waitForSelector` on a known element.
- **Capture client-side nav, not just anchors.** SPAs navigate via JS handlers, so
  `a[href]` under-counts. Also read rendered `button`, `[role="tab"]`, `[role="menuitem"]`,
  and nav landmarks to find the real transitions.
- **DOM outline over full HTML.** For each screen record: `title`, headings (`h1,h2,h3`),
  nav links, buttons (label/aria-label), tabs, and form controls (`input,textarea,select`
  with type/placeholder). That's a compact, diffable fingerprint of the screen.
- **Two ways to get data:**
  - **`context.request.get(url)`** reuses the session cookies to fetch data endpoints
    (framework payloads, JSON APIs) *without* rendering — fast, exact, ideal for Decode.
  - **`page.goto` + screenshot** for the visual/behavioral evidence.
- **Log the network.** Attach `page.on('response', …)` to record method, URL, status, and
  content-type; keep JSON bodies for Decode. Save raw to `.recon/traces/`.
- **Record a HAR for the Data contract.** Spec mode's per-screen/feature **Data contract**
  (methods, request + response shapes) comes from a HAR, not guesses. Create the context with
  `recordHar: { path: '.recon/traces/<slug>/network.har', content: 'embed' }` and close the
  context to flush it (`capture.mjs` does this per screen with `--no-har` to opt out). HARs
  embed request/response bodies **and can contain tokens** — they live under gitignored
  `.recon/` and are treated as sensitive.
- **Read endpoints from the HAR, never invent them.** A request you didn't trigger
  (read-only session) has no observed body — mark it *inferred*, don't fabricate one.
- **Screenshot every state** to `.recon/shots/<label>.png` — in SPAs the URL may not change
  across meaningful states, so the screenshot is the evidence.

## Make sure the capture actually captured (don't record nothing)

The worst failure isn't a crash — it's a run that *looks* captured but recorded the wrong
screen or a no-op. Guard against it:

- **Assert the final URL after every navigation.** Apps bounce to `/login`, `/home`, or
  `/unauthorized`. `capture.mjs` records `finalUrl`; **compare it to the route you asked
  for** — if they differ, you captured a redirect (an auth/gate signal, or an expired
  session), not the target. A spec written against the wrong screen is worse than a gap.
- **Dismiss consent / cookie banners first.** They overlay the page, intercept the clicks
  you use to trigger client-side nav, and turn a real screen into a phantom "empty" capture.
- **Verify a client-side nav actually changed the view.** In SPAs the URL often doesn't
  change across tabs/modes, so a click that silently no-ops looks like a captured state.
  Take a **content fingerprint** before and after (title + `h1,h2,h3` + a hash of visible
  text); if it's identical, the click did nothing — **escalate** (ref/selector click →
  coordinate click → focus + Enter → dispatched pointer event) before recording that state.
  If every method fails and no handler is attached, *that* is the finding.
- **Prove the recorder works.** A suspiciously clean console/network can mean the listener
  attached too late (or after a tab switch — listeners don't carry over). Hit one URL you
  expect to log (a deliberate 404) to confirm capture is live, then trust "clean elsewhere."

## Scaling the crawl

- Discover routes from a source of truth first (rendered link grid, `sitemap.xml`, or a
  route/tool manifest in the payload), then fetch each — don't hand-maintain URL lists.
- Scroll lazy grids (`mouse.wheel`) before scraping to load deferred cards.
- Be gentle: modest concurrency, real timeouts, and **stop at read-only**. Do not click
  anything that creates data, sends a message, or spends credits unless that action is
  explicitly authorized for this run.

## Safety checklist (every run)

- [ ] Target is owned / authorized; logged in as my own account.
- [ ] Headless; no destructive clicks; no credit/quota spend without sign-off.
- [ ] Auth state stays in `.recon/.auth/` (gitignored).
- [ ] Traces/screenshots treated as sensitive (may contain tokens/user data).
