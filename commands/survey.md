---
description: Survey an authorized web product — catalog every feature/screen/tool, map the IA, and record the control vocabulary.
argument-hint: [product URL or name — defaults to the configured target]
---

Run **recon** in **Survey** mode against: $ARGUMENTS

Confirm authorization first (owned / authorized target, your own session). Goal: catalog
**what exists** — every feature/tool/screen grouped by the product's own sections, the
information architecture, and the reused control vocabulary.

Discover routes from a source of truth (rendered link grid, `sitemap.xml`, or a route/tool
manifest in the framework payload) rather than guessing. Capture headless with
`skills/recon/scripts/capture.mjs`; decode the tool/route manifest with
`skills/recon/scripts/decode.mjs` where the app ships one. **Then actually fan out — spawn
one `surface-explorer` sub-agent per section, emitting all the calls in a single message so
they run concurrently** (see `fan-out.md`); don't enumerate serially or write the catalog
without having run the agents. Count honestly (unique features vs. modes; exclude
coming-soon/stubs) and attach a locator to every claim. Run the adversarial verify pass
before presenting.

Load `skills/recon/reference/mode-survey.md`, `fan-out.md`, `playwright.md`, and
`deliverables.md` first. Offer to persist to `.recon/notes/<product>-survey.md` and the
product-spec deliverable.
