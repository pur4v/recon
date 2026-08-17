# Reference: persistent knowledge base

recon accumulates understanding across sessions so re-analysis is incremental, not
from-scratch. This is what turns a one-off teardown into living competitive intelligence.

## Where notes live

**In a `.recon/` directory in your working directory (the recon workspace) — not in this
skill repo.** This keeps the skill generic and keeps sensitive captures out of version
control by default (`.recon/` is gitignored).

```
.recon/
├── notes/                       # one file per product/topic (start warm from these)
│   ├── <product>-survey.md
│   ├── <product>-journey.md
│   ├── <product>-decode.md
│   └── <product>-position.md
├── specs/                       # build-ready per-item specs (Spec mode)
│   ├── index.md                 # collates + links every spec, grouped by section
│   ├── _api.md                  # shared cross-screen API/XHR contract
│   ├── features/<slug>.md       # one file per feature
│   └── screens/<slug>/          # one folder per screen
│       ├── screen.md            #   the spec
│       ├── <slug>.spec.ts       #   executable, read-only Playwright check
│       └── test-cases.md        #   human-readable cases
├── traces/<slug>/network.har    # raw captured request/response — Data-contract source (SENSITIVE)
├── shots/                       # screenshots
├── diagrams/                    # ASCII-mirrored SVGs
├── .auth/                       # session storageState (SENSITIVE — never commit)
├── product-spec.md              # synthesized deliverable
├── competitive-analysis.md      # synthesized deliverable
└── battlecard.md                # synthesized deliverable
```

## Update protocol

On every recon run:

1. **Read first.** Load existing `.recon/notes/` before capturing — start warm, know what's
   already established.
2. **Diff, don't duplicate.** Update the relevant note in place; don't spawn a second file
   for a topic that already has one.
3. **Timestamp + freshness.** Stamp each note with the date last verified. Products change
   fast — mark claims "last verified <date>, re-check before relying."
4. **Same disciplines.** Every claim carries a locator. No secrets/tokens in notes
   (reference the location, never the value). Label observed vs inferred, confirmed vs
   masked, live vs marketing.
5. **Corrections stay.** When a later run overturns an earlier claim (a price changed, a
   competitor pivoted), replace it and note the correction — don't leave the stale version.

## What NOT to put in the KB

- Auth state, cookies, tokens, signed URLs, or any secret value. Reference the location.
- Invented pricing, feature counts, or model names. Mark unknowns as unknown.
- Marketing claims restated as fact. Keep the "claim vs. confirmed" label.

## Sensitivity note

Unlike a source-code KB, recon notes describe **live products and competitors** and its
captures can hold **tokens and user data**. `.recon/` is gitignored for a reason. If you
ever intend to share a note or commit it somewhere, run the secret scan
(`scripts/scan_secrets.sh`) and strip session material first.
