---
description: Write build-ready spec docs — per feature and per screen, with XHR/API contract and executable tests — from the surveyed item list.
argument-hint: [product URL or name; optionally "features only" / "screens only" / "replica" to include UI-inventory build sections]
---

Run **recon** in **Spec** mode on: $ARGUMENTS

Confirm authorization first (owned / authorized target, your own session). Goal: produce
**build-ready specs — per feature and per screen, with the backend/XHR contract** — deep
enough to rebuild the product from the docs. Survey gives the catalog; Spec gives the
per-item dossiers.

**Prerequisite:** run Survey first (or read `.recon/notes/<product>-survey.md`) for the item
list, and Decode where available (exact control types + backend pipelines). **Capture with
the HAR on** (`.recon/traces/<slug>/network.har`) — the Data contract comes from it. Then
**actually fan out — spawn one `surface-explorer` per feature and per screen, emitting all
the calls in a single message so they run concurrently** (one screen → one agent; batch
8–12 at a time for large sets and say so). Don't write specs without having launched the
per-item agents. Each writes from the matching template:
- Features → `skills/recon/assets/feature-spec-template.md` → `.recon/specs/features/<slug>.md`
- Screens → `skills/recon/assets/screen-spec-template.md` → `.recon/specs/screens/<slug>/screen.md`,
  plus `<slug>.spec.ts` (from `assets/screen-test-template.spec.ts`, **read-only**, your own
  `storageState`) and `test-cases.md` (from `assets/test-cases-template.md`).

Cover, for each item at **full depth**: identity/route/auth, purpose, page anatomy, modes
(per-mode controls — don't merge), every control + type from the **decoded config**,
inputs→outputs, backend model/pipeline (**confirmed vs masked**), **Data contract — every XHR
from the HAR** (`METHOD path`, request + response shape), credits, states
(empty/loading/error/quota), constraints, transitions **you actually triggered**, and recon
notes. Prefer decoded config over rendered DOM; read endpoints from the HAR (never invent a
body — mark untriggered mutations *inferred*); attach a locator to every claim.

Roll up a shared **`.recon/specs/_api.md`** (from `assets/api-contract-template.md`) deduping
every endpoint. Build `.recon/specs/index.md` linking every spec (grouped by section,
one-line purpose each) and cross-link the catalog rows in `product-spec.md`.

If `$ARGUMENTS` includes **`replica`**, also fill each spec's **UI inventory** section
(components needed, MISSING = foundation gap); otherwise omit that section (neutral mode).

Verify with the `verifier` agent (all modes captured? control types real? backend in a
payload or guessed? transitions observed? **every endpoint actually in a HAR?**).

Load `skills/recon/reference/mode-spec.md`, `fan-out.md`, `playwright.md`, and
`mode-decode.md` first.
