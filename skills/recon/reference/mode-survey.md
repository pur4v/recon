# Mode: Survey

Goal: catalog **what exists** in the product — every screen, tool, and feature — and how
the app is organized. This is the static surface map that the other modes build on.

Trigger phrases: "map this product", "what does it do", "catalog the features / tools /
screens", "what's the IA", "give me the full feature list".

## What to produce

- **Feature / tool catalog** — one row per feature, grouped by the product's own sections
  (verticals, nav groups). For each: name, what it does, where it lives (URL/route),
  inputs/controls, and any sub-modes/variants. Count them — and say the count out loud.
- **Information architecture** — the app shell: top-level nav, sections, and how the tree
  nests. An app-shell diagram (ASCII + SVG, see `deliverables.md`).
- **Control vocabulary** — the finite set of input controls the product reuses (upload,
  prompt, dropdown, slider, color, mask/brush, multi-select…). This tells you the
  interaction model at a glance and is often decodable from the page/config, not just the
  rendered DOM.
- **Glossary** — the product's internal names for things.

## Method

1. **Enumerate surfaces.** Marketing site, the authed app, sub-domains. Inside the app,
   find the section index (a nav, an "explore" grid, a sitemap route, or a route manifest
   in the page payload).
2. **Discover routes, don't guess them.** Prefer a real source of truth over clicking
   around: a rendered grid of links, a `sitemap.xml`, or a route/tool list embedded in the
   framework payload (see `mode-decode.md`). Clicking is the fallback, not the plan.
3. **Fan out** one sub-agent per section/vertical (`fan-out.md`). Each returns the same
   row shape so the catalog merges cleanly.
4. **Capture evidence** for each feature: a screenshot and the route. For controls, prefer
   the decoded config (exact control types) over eyeballing the DOM.
5. **Verify** the catalog: are all sections covered, is the count right, did "coming soon"
   / empty sections get miscounted as live? (This is a common error — flag stubs.)

## Discipline notes specific to Survey

- **Live vs coming-soon.** A tile in the nav is not proof the feature works. Mark stubbed /
  empty / gated sections separately and exclude them from the "live" count.
- **Count honestly.** "100+ tools" is a marketing number; report the *unique* count you
  actually enumerated, and how you counted (e.g. unique routes vs. modes/variants).
- **Multi-mode features.** One feature often has several modes/tabs (e.g. a "Change Colors"
  tool with 5 modes). Record both the feature count and the total flow count, and don't
  conflate them.
- **Decoded > rendered.** When the app ships its tool/route definitions in a payload,
  decode them — it's more complete and exact than crawling the DOM. Cross-check the two.

## Output shape

Lead with the count and the section breakdown, then the grouped catalog table, then the
IA diagram, then the glossary and an "unknown / not exposed" list. Persist to
`.recon/notes/<product>-survey.md` and, if it's a full teardown, into the product-spec
deliverable (`assets/product-spec-template.md`).

## Survey → Spec

Survey is the *catalog* — one row per feature/screen, the whole surface at a glance. When
you need per-item depth (every control by mode, the backend pipeline, states, transitions —
enough to rebuild the feature), that's **Spec** mode: run Survey first for the item list,
then hand it to `mode-spec.md`, which fans out one dossier per feature and per screen.
