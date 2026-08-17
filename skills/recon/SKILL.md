---
name: recon
description: >-
  Reconnoiter a live web product you own or are authorized to test, and bring back
  verified, evidence-backed understanding of it. Use when you need to catalog a product's
  features and screens, map the user journey / funnel / screen transitions, write
  build-ready spec docs for every screen and feature (with the backend/XHR API contract from
  the network trace and executable read-only tests), decode what a
  web app is really doing under the hood (framework payloads, hidden config, the
  vendor/model layer behind an AI product), work out its ICP / pricing / GTM, or build a
  competitor landscape and sales battlecard. Drives the real product headless with
  Playwright and treats what's observed as the source of truth. Triggers: "map this
  product / what does it do", "catalog the features / screens / tools", "map the user
  journey / funnel / screen transitions", "spec out each feature / screen / write a spec doc
  per feature / reverse-engineer a PRD", "what's it built on / decode the payloads / what
  models does it use", "who's it for / how is it priced", "competitor analysis / landscape
  / battlecard / how do we stack up". Authorized, owner-operated recon only.
---

# recon

A scout goes ahead into unknown territory and brings back **verified** intel. `recon` does
that for a **live web product**: point it at a product you own or are authorized to test,
drive it headless with Playwright, capture hard evidence (DOM, network, screenshots,
decoded payloads), and produce shareable artifacts — a product spec, a journey/funnel map,
a decoded model layer, build-ready per-screen/per-feature specs, a competitive analysis, a
battlecard — plus a knowledge base so the next session starts warm.

Built for the moment you have to answer, quickly and correctly: *what does this product
actually do, how is it built, who is it for, and how do we beat it?*

## Authorization — read this first (non-negotiable)

`recon` inspects **running products**, not just source you own. That makes authorization a
precondition, not an afterthought:

- **Owner-operated or explicitly authorized only.** Only run recon against a product you
  own, operate, or have written authorization to assess. If you can't name that
  authorization, stop.
- **Use your own account.** Log in as yourself (or a sanctioned test account). **Never**
  bypass authentication, reuse harvested/leaked credentials, brute-force, or evade rate
  limits or bot controls.
- **Non-destructive.** Read-only by default. Do not submit real forms, create real leads,
  send messages, place orders, or spend paid credits/quota **without explicit per-run
  authorization** for that specific action.
- **Respect the boundary.** Public marketing pages and your own authed app are in scope.
  Other tenants' data, other people's accounts, and unauthorized targets never are.

If a request would cross any of these lines, say so and stop — don't improvise around it.

## When to use this skill

Use it when the real job is *"understand a live product I'm authorized to inspect, and be
able to trust the answer."* That covers six recurring jobs (the **modes** below). A single
request usually chains several — survey the surface, spec each item, map the journey, decode
what's under it, work out positioning, then build the competitive view.

Do **not** spin up the full machinery for a single fact you can read off one page. Recon
earns its cost on breadth (many screens, whole funnels, a decoded app, a competitor set).

## The six modes

| Mode | You ask… | recon produces | Reference |
|---|---|---|---|
| **Survey** | "map this product / catalog the features / what screens exist" | Feature & IA catalog: every screen/tool/feature, the navigation map, the control vocabulary, an app-shell diagram | `reference/mode-survey.md` |
| **Spec** | "spec out each feature / screen / write a spec doc per feature / reverse-engineer a PRD" | Build-ready specs — **per feature and per screen** — controls, modes, backend model, **the XHR/API Data contract (from the HAR) + a shared `_api.md`**, states, transitions, plus an executable read-only `<slug>.spec.ts` + `test-cases.md`; optional replica/build mode. Deep enough to rebuild from | `reference/mode-spec.md` |
| **Journey** | "map the user journey / funnel / screen transitions" | End-to-end journey (first-touch → activation → habit), a screen-transition graph, and the activation/conversion funnel with drop-off points | `reference/mode-journey.md` |
| **Decode** | "what's it built on / decode the payloads / what models does it use" | Decoded framework/network payloads → recovered schemas, hidden config, and the de-masked vendor/model/pipeline layer behind an AI product | `reference/mode-decode.md` |
| **Position** | "who's it for / how is it priced / GTM" | ICP & segments, pricing & packaging, credit/quota economics, the go-to-market funnel | `reference/mode-position.md` |
| **Compete** | "competitor landscape / battlecard / how do we stack up" | Named-competitor landscape, a feature/pricing parity checklist, and a one-page sales battlecard | `reference/mode-compete.md` |

**Survey vs Spec:** Survey is the *catalog* (one row per feature, the whole surface at a
glance). Spec is the *dossier* (one deep file per feature and per screen). Run Survey first
to get the item list, then Spec to write it up.

**Survey vs Journey:** Survey is *what exists* (the static surface — screens, features,
IA). Journey is *how a user moves through it* (order, transitions, funnel, drop-off).

Read the relevant mode file before producing that artifact. Load only the ones you need.
Playwright is the capture engine for all of them — see `reference/playwright.md`.

## The five disciplines (every mode)

These are what make the output *trustworthy*. They are not optional.

1. **Authorized & owner-operated.** (See the box above.) Your own account; no auth bypass;
   nothing destructive without per-run sign-off. This discipline outranks the other four.

2. **Evidence or it didn't happen.** Every non-trivial claim carries a concrete locator —
   a **URL + selector**, a **network endpoint**, a **screenshot path**, or a **decoded
   payload field**. Observed behavior is the source of truth. And always label:
   - **observed vs inferred** — what you *saw the product do* vs what you *deduced*. A price
     on the pricing page is observed; "so their ACV is ~$X" is inferred.
   - **live vs marketing** — a claim on a landing page is a *claim*; confirm it against the
     running app before repeating it as fact.
   - **confirmed vs masked** — for AI products, a model named in the UI/payload is confirmed;
     a model the runtime hides is *masked* — say "vendor/model not exposed at runtime"
     rather than guessing.
   - **Never fabricate** feature names, prices, tiers, endpoints, or vendors. Unknown is
     "unknown / not exposed," never an invention.

3. **Parallel fan-out (actually invoke the agents).** For anything spanning many screens,
   several verticals, or a set of competitors, **spawn one `surface-explorer` sub-agent per
   surface/vertical/competitor — one screen, one agent — emitting all the calls in a single
   message so they run concurrently**, then synthesize. This is an operating instruction:
   Survey and Spec run over many screens, so they *must* launch per-screen agents, not
   describe a fan-out that never ran. Never grind serially. See `reference/fan-out.md`.

4. **Adversarial verify pass.** Before presenting, re-check the findings — ideally with a
   fresh sub-agent tasked to *refute*: are the feature counts real, the price tiers current,
   the model attributions actually in the payload, the funnel steps in that order? Downgrade
   or drop anything a skeptic can break.

5. **Credential- & secret-safe.** Auth state (cookies, tokens, `storageState`) lives in a
   **gitignored** `.recon/.auth/` and is **never committed**. Mask session material and
   secrets in any shareable output. Captured traces can contain tokens — treat them as
   sensitive.

## Standard workflow

1. **Authorize & scope.** Confirm you own / are authorized to test the target. Identify the
   surfaces: marketing site, the authed app, sub-domains, the verticals/sections inside it.
2. **Set up capture.** Log in as yourself once and save `storageState` to `.recon/.auth/`
   (`scripts/auth-setup.mjs`). All later runs are headless and reuse it. See
   `reference/playwright.md`.
3. **Capture.** Drive the product headless — enumerate screens, capture DOM outlines,
   network, and screenshots (`scripts/capture.mjs`); decode framework payloads where they
   carry the real schema (`scripts/decode.mjs` and `reference/mode-decode.md`).
4. **Fan out** — enumerate the screens/sections, then **launch one `surface-explorer` per
   screen in a single message** (concurrently); collect their structured findings. Don't
   write the catalog/spec without having actually run the per-screen agents.
5. **Synthesize** into the artifact(s) for the active mode(s).
6. **Verify.** Adversarial pass over the synthesized claims. Correct or downgrade anything
   that doesn't hold.
7. **Sanitize.** Confirm no auth state / secrets are in anything shareable or committed.
8. **Persist.** Write/update the knowledge base under `.recon/` (`reference/knowledge-base.md`).
9. **Report.** Lead with the answer. Keep locators. Flag what's unknown / not exposed /
   inferred honestly rather than papering over it.

## Persistent knowledge base

Recon accumulates understanding so re-analysis is incremental, not from-scratch.

- KB notes and raw captures live in a **`.recon/`** directory in your working directory
  (the recon workspace), **not** in this skill repo — that keeps the skill generic.
- Layout: `.recon/notes/` (one file per product/topic), `.recon/traces/` (raw captures),
  `.recon/shots/` (screenshots), `.recon/.auth/` (session state — **gitignored**),
  deliverables (`product-spec.md`, `competitive-analysis.md`, `battlecard.md`).
- On each run: read existing `.recon/` notes first (start warm), then update them with new
  findings and a fresh timestamp. Mark anything unverified as such.

See `reference/knowledge-base.md` for the format and update protocol, and
`assets/*-template.md` for deliverable shapes.

## Output principles

- Lead with the conclusion; put the evidence trail under it.
- Prefer a table or a small diagram (screen-transition graph, funnel, model-layer map) over
  a wall of prose. See `reference/deliverables.md` for the ASCII+SVG conventions.
- Keep a **glossary** of the product's internal names, tiers, and vendors — readers drown
  in unexplained product jargon.
- Always include a "what's still unknown / not exposed / inferred" section. Honesty about
  gaps is the point.
