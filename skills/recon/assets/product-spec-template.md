<!--
  recon product-spec template. Copy into the recon workspace (.recon/product-spec.md).
  Rules: a locator on every non-trivial claim (URL+selector / endpoint / screenshot /
  payload field) · observed vs inferred · confirmed vs masked · no secrets · stamp the date.
-->

# <Product> — product spec (reverse-engineered)

- **Last verified:** <YYYY-MM-DD>
- **Surfaces:** <marketing site · app domain · sub-domains>
- **Authorization:** <owner-operated / authorized test account — state it>
- **Status:** <draft | partially verified | verified>

## TL;DR

<3–5 sentences: what the product is, who it's for, how it's built, what's notable.>

## 1. Information architecture

<App-shell tree (ASCII). SVG: .recon/diagrams/<slug>-ia.svg>

## 2. Feature / tool catalog

**<N> unique features across <M> sections** (say how you counted; flag stubs/coming-soon).

| Section | Feature | What it does | Route | Controls | Modes | Evidence |
|---|---|---|---|---|---|---|
| <section> | <name> | <one line> | `/route` | upload/prompt/… | <n> | shot / payload field |

## 3. User journey & funnel

<Staged journey table + screen-transition graph (ASCII). SVG: .recon/diagrams/<slug>-journey.svg>
<Structural funnel with the gate on each step. Mark measured vs structural.>

## 4. Stack & (for AI) model layer

- **Framework / auth / payments / CDN / analytics / realtime / errors:** <each with evidence>
- **Model / vendor layer:** table of confirmed (named in payload — cite field) vs masked.

## 5. Pricing & economics

<Tiers, what's gated, the pricing axis, credit/quota unit + free allowance.>

## Glossary

- **<internal name>** — <what it is>.

## Unknown / not exposed / inferred

- <gaps: masked models, gated sections, inferred numbers — labelled honestly>

## Change log

- <YYYY-MM-DD> — <what changed / what a later run corrected>
