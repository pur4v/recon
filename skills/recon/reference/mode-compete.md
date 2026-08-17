# Mode: Compete

Goal: turn everything recon has learned into a **competitive view** — a named-competitor
landscape, a feature/pricing parity checklist, and a one-page sales battlecard.

Trigger phrases: "competitor analysis", "competitive landscape", "how do we stack up",
"parity checklist", "battlecard", "where can we win".

## What to produce

- **Landscape** — the named players in the category, banded by positioning (e.g. enterprise
  suite vs. self-serve/prosumer vs. adjacent platform). For each: positioning, ICP, model/
  tech layer, pricing visibility, and threat level. A comparison table.
- **Parity checklist** — capability by capability: who has it, is it table-stakes or a
  differentiator, and where the gap is. This drives the "what we must match vs. where we
  can win" split.
- **Battlecard (one page)** — for sales/exec: what the target *is*, its strengths (don't
  attack head-on), a vulnerability → your-play → proof-point table, trap questions to ask a
  leaning buyer, landmines (where you lose — qualify out), and a positioning one-liner. Use
  `assets/battlecard-template.md`.

## Method

1. **Baseline the target** from the Survey/Journey/Decode/Position notes — that's your
   anchor column.
2. **Fan out** one sub-agent per competitor (`fan-out.md`). Each researches from **public
   sources only** (the competitor's own site, docs, pricing) — you are not authorized to
   log into competitors' products. Same output contract per competitor.
3. **Normalize** into the landscape table and the parity checklist. Dedupe overlapping
   claims; note which source each came from.
4. **Verify** — flag stale/defunct/pivoted competitors, demo-gated pricing (don't invent
   tiers), and unverified marketing claims. Refute weak differentiators before they reach a
   battlecard.

## Discipline notes specific to Compete

- **Authorized surfaces only.** Recon *drives* only the product you own/are authorized to
  test. Competitors are researched from their **public** marketing/docs — never by logging
  into or probing their app.
- **Don't fabricate competitor pricing.** If it's behind a demo, say "demo-gated"; unknown
  tiers stay unknown.
- **Flag the dead.** Domains get parked, products pivot or shut down. Verify a competitor is
  still live before ranking it; mark defunct/pivoted ones as out of market.
- **Defensible battlecards only.** Every "where they're weak" needs a real basis. Blanket
  FUD gets a rep killed in a deal — win on chosen axes with proof points.
- **Model isn't the moat (usually).** In AI categories most players orchestrate the same
  foundation models. Say so, and point the fight at workflow depth, packaging, trust, and
  price where that's the truth.

## Output shape

Lead with the category map and the single biggest threat. Then the landscape table, the
parity checklist, and the battlecard. Persist to `.recon/competitive-analysis.md` and
`.recon/battlecard.md`.
