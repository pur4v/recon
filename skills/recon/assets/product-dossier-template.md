<!--
  recon PRODUCT DOSSIER — the master handoff. One document that ties every artifact together
  so a reader can decide what to build and how. Synthesized from ALL modes; it links out to
  the detailed files rather than duplicating them. Save to .recon/dossier/<product>.md
  (or .recon/dossier/index.md). Rules: lead with the answer · a locator on every claim ·
  observed vs inferred · never copy proprietary assets — describe behaviour, don't lift.
-->

# Product dossier: <Product> — <one-line what-it-is>

- **Captured:** <YYYY-MM-DD> · **Session:** <your own authed account | public> · **Surfaces:** <marketing, app host(s)>
- **Depth:** <Smoke | Standard | Deep> · **Status:** <verified | partial | draft>
- **Authorization:** <owned / written authorization — name it>

## 1. TL;DR — what this is and why it matters

<3–5 sentences: what the product does, who it's for, the core value, how it makes money.
Everything downstream is evidence for these lines.>

## 2. What it does (feature map)

<The Survey catalog in miniature — sections → features. Link the full spec.>
→ **Full survey:** [`product-spec.md`](../product-spec.md) · **IA diagram:** `.recon/diagrams/app-shell.svg`

| Section | Key features | Depth doc |
|---|---|---|
| <section> | <features> | [`specs/screens/<slug>/screen.md`](../specs/...) |

## 3. Screens (build-ready specs)

Every screen has a folder under [`specs/screens/`](../specs/index.md): `screen.md` +
`<slug>.spec.ts` + `test-cases.md`. Shared API in [`specs/_api.md`](../specs/_api.md).

| Screen | Route | Spec | Screenshot | What changes it (key XHR → effect) |
|---|---|---|---|---|
| <name> | `/route` | [screen.md](../specs/screens/<slug>/screen.md) | `.recon/shots/<slug>.png` | `POST /x` → renders result |

## 4. User journey

- **Aha moment:** <the step where value first lands> — <N> steps to reach it.
- **Walkthrough video:** `.recon/videos/<journey>/*.webm` · **Storyboard:** `.recon/shots/journey/`
- **Transition graph:** `.recon/diagrams/journey-graph.svg` · **Funnel + gates:** below / journey doc

→ **Full journey:** [`<product>-journey.md`](../notes/<product>-journey.md)

## 5. Data & backend (what powers it)

- **Shared API contract:** [`specs/_api.md`](../specs/_api.md) — every endpoint deduped.
- **Model/vendor layer** (AI products): <confirmed vs masked> → [decode note](../notes/<product>-decode.md)
- **Cause → effect:** which call changes what on screen lives in each screen's Data contract.

## 6. Design language

<Behavioral description of the visual system — NOT copied assets.>
→ **Full doc:** [`design-language.md`](design-language.md) (colors, type, spacing, components, motion)

## 7. Copy & content

→ **Inventory:** [`copy-inventory.md`](copy-inventory.md) — exact labels, CTAs, empty/error/success text.

## 8. Analytics — what the product measures

→ **Events:** [`analytics-events.md`](analytics-events.md) — beacons + events observed in the trace.
The product's own instrumentation is a strong signal of what it thinks matters.

## 9. Positioning & pricing

- **ICP / segments:** <who it's for> · **Pricing/packaging:** <tiers, credit economics — observed>
→ **Full:** [`competitive-analysis.md`](../competitive-analysis.md) · [`battlecard.md`](../battlecard.md)

## 10. If we were to build this — implications

<The PM read: what's core vs peripheral, what's cheap vs hard, what the foundation needs.
This section is the bridge to a builder (e.g. bob). Keep observed-vs-inferred honest.>

## 11. Unknown / not exposed / inferred

- <states not reachable, masked vendors, funnel rates you can't measure, inferred pricing>
