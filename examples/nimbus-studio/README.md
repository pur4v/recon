# Worked example: "Nimbus Studio"

> ⚠️ **Entirely fictional.** Nimbus Studio, its features, vendors, models, prices, and the
> competitors below are invented to demonstrate recon's seven modes. Any resemblance to a
> real product is coincidental. No real credentials, endpoints, or captures appear here.

This example shows the output shape of the modes on a small imaginary product:

- **Document** (flagship) → [`dossier/index.md`](dossier/index.md) — the master handoff tying
  everything together, plus [`design-language.md`](dossier/design-language.md),
  [`copy-inventory.md`](dossier/copy-inventory.md), [`analytics-events.md`](dossier/analytics-events.md)
- **Survey + Journey + Decode** → `product-spec.md` (journey adds a walkthrough video + storyboard)
- **Spec** → `specs/` — build-ready dossiers per feature ([`restyle`](specs/features/restyle.md))
  and per screen ([`create/screen.md`](specs/screens/create/screen.md) + its
  [`create.spec.ts`](specs/screens/create/create.spec.ts) / [`test-cases.md`](specs/screens/create/test-cases.md)),
  a shared API contract with a cause→effect column ([`_api.md`](specs/_api.md)), indexed by [`index.md`](specs/index.md)
- **Position + Compete** → `competitive-analysis.md`
- **Compete (battlecard)** → `battlecard.md`

## The imaginary product

**Nimbus Studio** (`studio.nimbus.example`) is a fictional generative-AI design tool for
marketing teams. Marketing site on `www.nimbus.example`; the app is a SvelteKit SPA behind
an OAuth login. It orchestrates third-party image/video models (it owns none) and meters
usage in "sparks" (1 spark / image, 5 sparks / video).

These files are deliberately short — they illustrate *structure and disciplines*
(locators, observed-vs-inferred, confirmed-vs-masked, honest gaps), not depth.
