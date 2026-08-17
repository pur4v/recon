<!--
  recon knowledge-base note template. Copy into the recon workspace under .recon/notes/,
  one file per product/topic. Rules: a locator on every claim · NO secret values (reference
  the location) · label observed/inferred and confirmed/masked · stamp last-verified date.
-->

# <Product / topic> — <what this note covers>

- **Last verified:** <YYYY-MM-DD>
- **Surface(s):** <which URLs/sections this note covers>
- **Authorization:** <owner-operated / authorized test account>
- **Status:** <verified | partially verified | draft>

## Summary

<2–4 sentences a teammate can read to get the gist.>

## Findings

| Claim | Locator (URL+selector / endpoint / shot / payload field) | Label |
|---|---|---|
| <what is true> | `…` | observed / inferred / confirmed / masked |

## Diagram (if applicable)

```
<ASCII: app-shell tree / screen-transition graph / model-layer map>
```

SVG: `.recon/diagrams/<slug>.svg`

## Glossary

- **<internal name>** — <what it is>.

## Unknown / not exposed / inferred

- <gap, and why (masked at runtime, gated, demo-only, deduced)>

## Change log

- <YYYY-MM-DD> — <what changed / what a later run corrected>
