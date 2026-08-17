# Reference: deliverables & diagrams (ASCII + SVG)

recon ships two kinds of output: **prose/table deliverables** (product spec, competitive
analysis, battlecard) and **diagrams** (app-shell tree, screen-transition graph, funnel,
model-layer map). Diagrams are emitted as **ASCII inline + a saved SVG** from one shared
model, so the two views can't drift.

## Deliverables (use the templates in `assets/`)

| Deliverable | Template | Built from modes |
|---|---|---|
| Product spec | `assets/product-spec-template.md` | Survey + Journey + Decode |
| Feature spec (one per feature) | `assets/feature-spec-template.md` | Spec (+ Decode) |
| Screen spec (one per screen) | `assets/screen-spec-template.md` | Spec (+ Survey) |
| Shared API contract | `assets/api-contract-template.md` | Spec (rolled up from every Data contract) |
| Screen test (executable) | `assets/screen-test-template.spec.ts` | Spec (read-only Playwright check) |
| Test cases (per screen) | `assets/test-cases-template.md` | Spec |
| Competitive analysis | `assets/competitive-analysis-template.md` | Position + Compete (+ the spec) |
| Battlecard (1 page) | `assets/battlecard-template.md` | Compete |
| KB note | `assets/kb-template.md` | any |

The Spec-mode files are build-ready per-item dossiers, collated by `.recon/specs/index.md`
with a shared `_api.md`. Features live at `.recon/specs/features/<slug>.md`; each screen is a
folder `.recon/specs/screens/<slug>/` holding `screen.md` + `<slug>.spec.ts` + `test-cases.md`.
See `reference/mode-spec.md` for depth, the XHR Data contract, the replica toggle, and the
fan-out (one agent per feature and per screen).

Lead every deliverable with the conclusion; put the evidence trail (locators) under it.
Prefer tables and diagrams over walls of prose. Always end with "unknown / not exposed /
inferred."

## Diagrams: the shared model

Before drawing, write the model down once:

- **Nodes**: `id | label | kind`, where `kind` ∈ `screen` | `gate` | `external` | `state`.
  - `screen`/`state` nodes carry a route or a screenshot path.
  - `gate` nodes name the barrier (auth / verify / paywall / quota).
  - `external` nodes name a third party (vendor/model/CDN) and *why* it's external.
- **Edges**: `from → to | trigger` — the user action or system event that moves between
  states. Draw an edge only where you actually observed the transition.

Render ASCII from this list, then the SVG from the same list. Same nodes, same edges.

## Diagram types

- **App-shell tree** (Survey) — the IA: top nav → sections → sub-sections.
- **Screen-transition graph** (Journey) — states + user-action edges; mark gates distinctly.
- **Funnel** (Journey/Position) — vertical stages with the gate on each step.
- **Model-layer map** (Decode) — the product as an orchestrator box fanning out to the
  external vendor/model nodes it calls; mark confirmed vs masked.

## SVG authoring conventions

Author SVG **by hand from a fixed template** — no renderer, no dependency. Vertical flow,
top → bottom; one box per node; fixed geometry so boxes never overlap.

- Box `260×48`; center `x=150` (branch second column at `x=470`, canvas width `620`);
  vertical pitch `108`; first box top at `y=20`; canvas height `20 + nodes*108`.
- **Kind → style** (legible on light *and* dark via an explicit background rect):
  | kind | fill | stroke | dash |
  |---|---|---|---|
  | screen | `#eef2ff` | `#4f46e5` | (solid) |
  | state | `#ecfdf5` | `#059669` | (solid) |
  | client/exit | `#f5f5f4` | `#57534e` | (solid) |
  | gate | `#fef2f2` | `#dc2626` | (solid) |
  | external | `#fff7ed` | `#ea580c` | `6 4` (dashed) |
- Node label centered (`13px system-ui`); a second line (`10px #6b7280`) carries the route /
  screenshot path (screens) or the reason (external/gate). Edge label to the right of the
  arrow (`11px #6b7280`).
- First child is `<rect width=100% height=100% fill="#ffffff"/>`; one reusable `<marker>` for
  arrowheads. Plain boxes-and-arrows — no gradients or shadows.

## Where diagrams go

Save alongside the deliverables in the recon workspace:
`.recon/diagrams/<slug>.svg` (e.g. `.recon/diagrams/journey-graph.svg`). Link from the
deliverable: `Diagram: .recon/diagrams/journey-graph.svg`.

## Consistency check (before shipping a diagram)

- Every `screen`/`state` node has a route or screenshot; every `external`/`gate` states why.
- The SVG has the **same** nodes and edges as the ASCII — same count, same markers.
- No invented transition. If you didn't trigger it, it isn't an edge.
