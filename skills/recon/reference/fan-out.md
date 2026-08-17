# Reference: parallel fan-out

The core execution pattern. Breadth is where recon earns its keep — never grind through
screens, verticals, or competitors serially.

## Rule

For any question spanning **many screens, several product verticals, or a set of
competitors**, spawn **one sub-agent per surface/vertical/competitor** and run them
**concurrently**, then synthesize. Give every sub-agent the *same* focused question and the
*same* output contract so results merge cleanly.

## When to fan out vs. answer directly

- **Fan out**: "catalog every tool across all sections", "map the funnel across all entry
  paths", "research these six competitors", "decode every route's payload".
- **Answer directly** (no fan-out): a single fact on one known page. Don't pay orchestration
  cost for a one-liner.

## Sub-agent prompt contract

Each sub-agent gets:

1. **Exact scope**: the one section / vertical / competitor it owns — spelled out.
2. **The specific questions**: features + routes + controls (Survey); states + transitions +
   gates (Journey); payload fields + vendors (Decode); tiers + ICP signals (Position);
   positioning + pricing + threat (Compete).
3. **The output shape**: an evidence-first report — every claim with a **locator** (URL +
   selector / endpoint / screenshot path / payload field).
4. **Guardrails**: authorized surfaces only; read-only; nothing destructive; **for
   competitors, public sources only — do not log into their app**.

## Synthesis

- Merge per-surface findings into the artifact for the active mode.
- **Dedupe** overlapping findings before presenting; note which surface each came from.
- Where surfaces disagree or a feature has no clear owner/route, say so — that's often the
  interesting part (a stub, a hidden flag, a defunct competitor).

## Adversarial verify pass (discipline #4, applied here)

After synthesis, run a verification step over the merged claims:

- Ideally a **fresh** sub-agent tasked to *refute* each claim, not confirm it (the
  `verifier` agent).
- Diverse lenses: is the feature actually live (not a stub)? is the count right? is that
  price current and in-app? is that model actually named in a payload?
- Downgrade or drop anything that doesn't survive. This pass routinely catches: counting
  coming-soon tiles as live, "100+ tools" overstatements, invented pricing, and models
  named from vibes rather than a payload field.

## Cost awareness

Fan-out spends tokens. Scale the fleet to the ask: a few agents for "how does X work", a
larger pool + multi-vote verify for "thoroughly tear down the whole product and five
competitors". State when you cap coverage (top-N sections, sampled routes) — silent
truncation reads as "covered everything."
