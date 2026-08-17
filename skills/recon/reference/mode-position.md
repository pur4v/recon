# Mode: Position

Goal: work out **who the product is for and how it makes money** — ideal customer profile,
segments, pricing & packaging, credit/quota economics, and the go-to-market funnel.

Trigger phrases: "who's it for", "what's the ICP", "how is it priced", "pricing tiers",
"what's the credit model", "what's the GTM motion".

## What to produce

- **ICP & segments** — who they target, in their own words and by signal (logos on the
  site, case studies, the language on the pricing/enterprise pages, gated vs self-serve).
  Distinguish the *stated* ICP from the *observed* one.
- **Pricing & packaging** — the tiers, what each includes, what's gated to "contact us,"
  and the axis of price discrimination (seats, usage, features, support).
- **Usage/credit economics** — if metered: the unit (per image, per video, per seat), the
  free allowance, and how the balance/limit is computed. Decode this from the billing UI /
  payload where possible (see `mode-decode.md`), not just the marketing copy.
- **GTM funnel** — how they acquire and convert: PLG self-serve vs. sales-led/demo-gated,
  the free-trial shape, the upgrade prompts, and where money is first required.

## Method

1. **Read the money pages** — pricing, enterprise, and the in-app billing/plan screens
   (as your authorized account). Screenshot the tiers.
2. **Decode the plan objects** where the app hydrates subscription/entitlement data —
   that's the ground truth for what a plan actually grants, vs. the marketing table.
3. **Signal-read the ICP** — logo walls, testimonials, the vocabulary (SMB vs enterprise
   language), SOC2/SSO/on-prem availability (an enterprise gate), and whether pricing is
   public (self-serve) or hidden (sales-led).
4. **Verify** — is a claimed price current and in the app, or stale marketing? Is the free
   tier as generous as stated? Refute inferred ACV/segment claims you can't support.

## Discipline notes specific to Position

- **Stated vs observed ICP.** The site may say "for everyone"; the pricing, gates, and
  logos say who it's *really* for. Report both and note the gap.
- **Marketing claim vs mechanism.** "Save 90% of time" is a claim; the credit model and the
  gates are mechanisms. Keep them separate.
- **Inference, labelled.** ACV, margins, and segment size are inferences from public
  signals — mark them clearly and give the reasoning, never as measured fact.
- **Demo-gated pricing.** If pricing is behind "contact sales," say pricing is not public;
  do not fabricate numbers.

## Output shape

Lead with the one-line ICP and the pricing-axis summary. Then the tier table, the credit
economics, and the GTM funnel. Persist to `.recon/notes/<product>-position.md` and feed the
competitive-analysis deliverable.
