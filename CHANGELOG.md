# Changelog

All notable changes to recon are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — recon as build-ready product documentation
- **Document mode (flagship)** — `/recon:document` produces a **product dossier**
  (`assets/product-dossier-template.md` → `.recon/dossier/index.md`): one build-ready handoff
  tying together every artifact (overview, screens, journey+video, data/API contract, design
  language, copy, analytics) so it can serve as the basis to build. Chains Survey + Spec +
  Journey + Decode and assembles them. recon is now **seven modes**.
- **Journey walkthrough video** — `scripts/journey.mjs` records one Playwright `.webm` of an
  ordered walk plus a numbered storyboard shot per step and logs which requests each step
  fired. `capture.mjs --video` records per-screen clips. Read-only by default; `fill:`/`press:`
  gated behind `--allow-input`.
- **API cause→effect** — the Data contract and shared `_api.md` now carry a **"changes on
  screen"** column (which XHR repaints which region), from watching the network on each action.
- **New capture signals** in `capture.mjs`: `--mobile` (390px responsive shots), observed
  **design tokens** (`design`), **copy** inventory (`copy`), and **analytics beacons**
  (`analytics`, matching Segment/Amplitude/PostHog/GA/…).
- **New deliverable templates**: `product-dossier`, `copy-inventory`, `design-language`,
  `analytics-events`. Decode mode now rolls up the analytics/events the product fires.
- **Mandatory per-screen fan-out** — Survey/Spec/Journey/Document now *actually invoke* one
  `surface-explorer` per screen in a single concurrent message (`fan-out.md`: "Fire the
  agents — don't just plan them"), not describe a fan-out that never ran.
- **Capture-reliability hardening** (`playwright.md`): assert final URL vs. requested, dismiss
  consent banners first, verify a client-side nav actually changed the view (content
  fingerprint + click escalation), prove the recorder is live.
- Example `nimbus-studio/` gains a `dossier/` (index + design-language + copy-inventory +
  analytics-events) and cause→effect columns.

## [0.1.0] — 2026-08-17

First public release.

### Added
- **The recon skill** (`skills/recon/`) with six modes — **Survey**, **Spec**, **Journey**,
  **Decode**, **Position**, **Compete** — and five disciplines: authorized &
  owner-operated, evidence-or-it-didn't-happen (locators + observed-vs-inferred,
  live-vs-marketing, confirmed-vs-masked), parallel fan-out, adversarial verify pass, and
  credential- & secret-safe by default.
- **Progressive-disclosure reference docs** (`skills/recon/reference/`): one per mode plus
  `fan-out.md`, `playwright.md` (the capture-engine recipe), `deliverables.md` (ASCII+SVG
  diagram conventions), and `knowledge-base.md`.
- **Runnable Playwright capture scripts** (`skills/recon/scripts/`):
  `auth-setup.mjs` (log in once as yourself, save the session), `capture.mjs` (headless
  DOM outline + network + screenshots, read-only), `decode.mjs` (multi-framework payload
  decoder — SvelteKit, Next.js Pages/App-Router, Remix, generic fallback), and
  `scan_secrets.sh` (session/secret backstop scan).
- **Build-ready Spec mode** — a spec per feature and per screen (`reference/mode-spec.md`,
  `/recon:spec`), deep enough to rebuild the product from: per-mode controls, backend
  model/pipeline (confirmed vs masked), I/O, states, and observed transitions, collated into
  `.recon/specs/index.md`. Each screen is a folder (`screen.md` + executable read-only
  `<slug>.spec.ts` + `test-cases.md`).
  - **Backend/XHR data contract** — every screen/feature spec captures the requests it fires
    (`METHOD path`, request + response shapes) from a recorded **HAR**, rolled up into a
    shared `_api.md`; `capture.mjs` now records a per-screen `network.har`.
  - **Replica/build toggle** — `/recon:spec … replica` adds a UI-inventory section marking
    MISSING components (foundation gaps); neutral "understand it" framing by default.
- **Deliverable templates** (`skills/recon/assets/`): product spec, **feature spec**,
  **screen spec**, **API contract**, **screen test (`.spec.ts`)**, **test cases**,
  competitive analysis, one-page battlecard, and KB note.
- **Persistent knowledge base** protocol — findings and captures written to a gitignored
  `.recon/` in the working directory.
- **Plugin packaging**: `.claude-plugin/plugin.json` and `marketplace.json` so recon can be
  installed via `/plugin marketplace add pur4v/recon`.
- **Slash commands**: `/recon:setup`, `/recon:survey`, `/recon:spec`, `/recon:journey`,
  `/recon:decode`, `/recon:position`, `/recon:compete`.
- **Sub-agents**: `surface-explorer` (fan-out worker) and `verifier` (adversarial checker).
- **Fictional worked example** under `examples/nimbus-studio/`.
- Project docs: `README`, `SECURITY`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, and CI.

[0.1.0]: https://github.com/pur4v/recon/releases/tag/v0.1.0
