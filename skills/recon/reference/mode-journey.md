# Mode: Journey

Goal: map **how a user moves through the product** — the end-to-end journey, the screen
transitions between states, and the funnel with its drop-off points. Survey is the static
surface; Journey is the motion across it.

Trigger phrases: "map the user journey", "what's the funnel", "screen transitions", "how
does onboarding / activation work", "where do users drop off".

## What to produce

- **End-to-end journey** — the ordered path a user takes, in stages: **first-touch →
  sign-up → onboarding → activation (first real value) → habit/expansion**. Each stage:
  the screens involved, the action required, and the friction.
- **Walkthrough video + storyboard** — a Playwright **video** of the whole walk plus a
  screenshot after every step (the storyboard). Run `scripts/journey.mjs <steps.txt>` — it
  records one `.recon/videos/<name>/*.webm` across the ordered path and drops numbered
  storyboard shots in `.recon/shots/journey/`, and logs how many requests each step fired
  (which action changed what). This is the primary artifact for "show me the journey."
- **Screen-transition graph** — states (screens/modals) as nodes, user actions as edges.
  ASCII inline **and** an SVG (see `deliverables.md`). Mark gated transitions (auth wall,
  paywall, quota wall) distinctly.
- **Funnel** — the conversion/activation steps in order, each with the gate that guards it
  (email, verification, payment, credit) and where a user can fall out. If you can't
  measure real drop-off (you don't have their analytics), say the funnel is *structural*
  (derived from the gates), not measured.
- **Aha moment** — name the step where the product first delivers value, and how many steps
  it takes to get there.

## Method

1. **Walk the happy path yourself**, as the authorized account, headless — from landing
   page through to the core action. Drive it with `scripts/journey.mjs` so the whole walk is
   recorded as **one video** with a **storyboard shot per step**; record the route and the
   trigger that advanced each transition. Keep the walk read-only (navigate + click);
   `fill:`/`press:` steps are gated behind `--allow-input` because typing/submitting can
   create data or spend credits — only enable them with per-run sign-off.
2. **Note client-side nav.** SPAs transition without full page loads and often without
   `<a href>` — capture the rendered buttons/tabs/handlers that drive transitions, not just
   anchor links. (Waiting for `networkidle` can hang on apps with live sockets; use
   `domcontentloaded` + an explicit settle. See `playwright.md`.)
2. **Identify the gates.** Where does the product require auth, verification, a plan, or
   credits? Those are the funnel's real steps.
3. **Fan out** across distinct entry paths if there are several (self-serve vs. demo-gated
   vs. invite) — each is its own journey.
4. **Verify** the ordering and the gates by re-walking, and refute "everyone hits this
   step" claims you can't actually see.

## Discipline notes specific to Journey

- **Structural funnel ≠ measured funnel.** Without the product's own analytics you are
  describing *the path and its gates*, not conversion rates. Never present invented
  percentages as measured. If the marketing site cites a number, label it a claim.
- **Confirm transitions, don't assume them.** Draw an edge only where you actually triggered
  it. A button that "should" open a screen isn't an edge until you clicked it.
- **Screenshot the state, not just the URL.** In SPAs the URL may not change across
  meaningful state changes; the screenshot + the DOM outline is the evidence.

## Output shape

Lead with the aha moment and the number of steps to it. Then the staged journey table, the
walkthrough video + storyboard link, the screen-transition graph, and the funnel with its
gates. Persist to `.recon/notes/<product>-journey.md`.
