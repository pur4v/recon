---
description: Document a product end-to-end — screens, journey (with video), data/API, design, copy, analytics — into one build-ready dossier.
argument-hint: [product URL or name] [optionally "smoke" | "standard" | "deep" — depth; defaults to standard]
---

Run **recon** in full **Document** mode on: $ARGUMENTS

Confirm authorization first (owned / authorized target, your own session). Goal: produce the
**product dossier** — the single, evidence-backed handoff that captures *everything about the
product* so it can serve as the basis to decide and build. This is recon's flagship: it
chains the other modes and assembles them. Not a persona — the output is comprehensive
product documentation, every claim backed by what the product actually does.

**Depth** (from `$ARGUMENTS`, default *standard*): `smoke` = key screens + one journey;
`standard` = all screens + main journeys + data/design/copy/analytics; `deep` = + edge
states, multiple journeys, per-role passes. Say which depth you ran.

**Capture with everything on:** `node skills/recon/scripts/capture.mjs <routes> --mobile`
(desktop + mobile shots, per-screen HAR, design tokens, copy, analytics beacons), and
`node skills/recon/scripts/journey.mjs <steps.txt> --name <journey>` for the **walkthrough
video + storyboard**. Keep it read-only (navigate + click); `--allow-input` only with per-run
sign-off.

**Then actually fan out — spawn one `surface-explorer` sub-agent per screen, emitting all the
calls in a single message so they run concurrently** (one screen → one agent; batch 8–12 for
large sets and say so). Don't assemble the dossier without having launched the per-screen
agents. Each screen-agent emits its `.recon/specs/screens/<slug>/` folder (`screen.md` +
`<slug>.spec.ts` + `test-cases.md`) with the **Data contract from the HAR including the
cause→effect column (which XHR changes what on screen)**.

Then synthesize the cross-cutting docs and the dossier:
- **`.recon/specs/_api.md`** — shared API contract (dedup every endpoint; effect column).
- **`.recon/dossier/design-language.md`** — `assets/design-language-template.md` (observed
  tokens; describe the system, **never copy proprietary assets**).
- **`.recon/dossier/copy-inventory.md`** — `assets/copy-inventory-template.md` (verbatim microcopy).
- **`.recon/dossier/analytics-events.md`** — `assets/analytics-events-template.md` (beacons/events).
- **`.recon/notes/<product>-journey.md`** — journey doc + video/storyboard link + transition graph.
- **`.recon/dossier/index.md`** — `assets/product-dossier-template.md`, linking all of the above.

Verify with the `verifier` agent (every screen captured? endpoints actually in a HAR? cause→
effect real? design tokens measured not guessed? events actually in the trace? journey edges
triggered?). Sanitize (no auth state / tokens in anything shareable) and report leading with
the TL;DR from the dossier.

Load `skills/recon/reference/mode-survey.md`, `mode-spec.md`, `mode-journey.md`,
`mode-decode.md`, `fan-out.md`, `playwright.md`, and `deliverables.md` first.
