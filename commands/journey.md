---
description: Map the user journey, screen transitions, and funnel of an authorized web product.
argument-hint: [product URL or name — defaults to the configured target]
---

Run **recon** in **Journey** mode against: $ARGUMENTS

Confirm authorization first. Goal: map **how a user moves through the product** —
first-touch → sign-up → onboarding → activation → habit, the screen-transition graph, and
the funnel with its gates and drop-off points.

Walk the happy path yourself (headless, your own account), screenshotting each state and
recording the trigger that advanced it. Capture client-side nav (buttons/tabs/handlers,
not just `<a href>`) and use `domcontentloaded` + a settle, never `networkidle`, on live
apps. Identify the gates (auth/verify/paywall/quota) — those are the funnel steps. Draw an
edge only where you actually triggered the transition. Distinguish a **structural** funnel
(gates) from a **measured** one (you don't have their analytics — never invent percentages).

Load `skills/recon/reference/mode-journey.md`, `playwright.md`, and `deliverables.md` (for
the screen-transition graph, ASCII + SVG). Verify with the `verifier` agent, then offer to
persist to `.recon/notes/<product>-journey.md`.
