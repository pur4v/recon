# Mode: Spec

Goal: produce **build-ready specs — one file per feature and one file per screen** — deep
enough that an engineer or PM could rebuild the thing from the doc. Survey gives you the
*catalog* (one row per feature); Spec gives you the *dossier* (one file per item).

Trigger phrases: "spec out each feature / screen", "write a spec doc per feature", "deep
spec", "reverse-engineer a PRD for this", "document every screen".

## Prerequisite

Run **Survey** first (or read `.recon/notes/<product>-survey.md`) so you have the item list —
the enumerated features and screens. Spec fans out over that list; it doesn't rediscover it.
Decode output helps a lot (exact control types, backend pipelines) — run it where available.

## What to produce

Cross-linked from an index, with a shared API contract and executable per-screen checks:

```
.recon/specs/
├── index.md                     # links every feature + screen spec; the map/catalog
├── _api.md                      # shared cross-screen API contract (assets/api-contract-template.md)
├── features/
│   └── <slug>.md                # one per feature (assets/feature-spec-template.md)
└── screens/
    └── <slug>/                  # one FOLDER per screen
        ├── screen.md            # the spec (assets/screen-spec-template.md)
        ├── <slug>.spec.ts       # executable, read-only Playwright check (assets/screen-test-template.spec.ts)
        └── test-cases.md        # human-readable cases (assets/test-cases-template.md)
```

Every screen spec carries a **Data contract** (the XHR it fires, from the HAR) that links to
the shared `_api.md`; features carry the request(s) they fire on run. The executable
`<slug>.spec.ts` asserts the *observed* behavior — read-only, using your own session — it is
recon, not a rebuild's test suite.

### Feature spec (build-ready) — must cover

- **Identity**: name, section, route(s), the screen(s) it lives on.
- **Purpose / job-to-be-done**: what a user hires it for, in one or two lines.
- **Modes / variants**: each mode/tab, and how they differ (often each mode has its own
  control set — record them per mode, not merged).
- **Controls (exhaustive)**: every input — label, **control type** (upload/prompt/dropdown/
  slider/color/mask/multi-select…, taken from the **decoded config** where possible, not
  just eyeballed), required?, default, range/options, and the config reference key.
- **Inputs → outputs**: what goes in, what comes out (output type: image/video/text/vector;
  `num_outputs`; any post-processing).
- **Backend model / pipeline**: **confirmed** (named in a payload — cite the field) vs
  **masked** (runtime hides it — say so).
- **Data contract (XHR)**: the request(s) this feature fires on run — `METHOD path`, request
  + response shape from the HAR. Link the shared `_api.md`; mark inferred bodies as inferred.
- **Cost / credits**: the metered unit for this action, if any.
- **States**: empty, loading/in-progress, success, error, and quota/paywall-blocked.
- **Constraints / validation**: file types, size limits, prompt limits, gating.
- **Evidence**: a locator per non-trivial claim + a screenshot path.
- **UI inventory (replica mode only)**: components needed, MISSING ones flagged.
- **Unknown / not exposed**.

### Screen spec (build-ready) — must cover

- **Identity**: name, `slug`, route, screenshot, auth (public / your own authed session).
- **Purpose**: what this screen is for.
- **Layout regions / page anatomy**: header / nav / main / side / footer, from the DOM outline.
- **Components**: the buttons, tabs, inputs, and data widgets present (from the DOM outline).
- **Data shown**: what the screen renders, and its source (decoded payload / API endpoint).
- **Data contract (XHR)**: **every request the screen fires**, read from the HAR — `METHOD
  path`, request + response shape, when it fires, and **what it changes on screen** (the
  cause→effect column: which call repaints which region). Link the shared `_api.md`. This is
  the backend/XHR layer — a first-class part of the spec, not an afterthought.
- **Copy**: the screen's key microcopy (CTAs, empty/error/success text) verbatim; full set in
  the copy inventory.
- **Responsive**: what changes desktop → mobile (from the `--mobile` shots).
- **States**: empty, loading, error, auth-gated, paywall/quota.
- **Transitions**: **in** (how you arrive here) and **out** (where each primary action leads)
  — edges you actually observed/triggered, not assumed.
- **Gates**: auth / verify / paywall / quota guarding this screen or its actions.
- **UI inventory (replica mode only)**: components needed, MISSING ones flagged as foundation
  gaps (see the replica toggle below).
- **Recon notes**: trace dir, capture date, which states you triggered vs. couldn't reach.
- **Evidence** + **Unknown / not exposed**.
- **Companion files**: `<slug>.spec.ts` (executable, read-only) and `test-cases.md`.

## Method

1. **Load the item list** from Survey; decide the feature set and screen set to spec. Keep a
   small **manifest** — `slug, route, auth (public/authed), group` per item — to drive fan-out
   and become `index.md` (mirrors a `screens.manifest`-style catalog).
2. **Capture with the HAR on** (and `--mobile` for responsive shots). Each screen/feature
   needs its network trace, not just the DOM — the Data contract comes from the HAR
   (`.recon/traces/<slug>/network.har`); the cause→effect column comes from watching which
   request fired on which action. See `playwright.md`.
3. **Fan out** — one `surface-explorer` per feature and per screen (`fan-out.md`). Give each
   the matching template as its output contract, plus the relevant capture (its screenshot,
   its DOM outline slice, its decoded config block, **its HAR slice**).
4. **Write one file per item** from the template; keep every control/mode/backend/endpoint
   claim locator-backed. Prefer **decoded config** over rendered DOM for control types and
   pipelines; read endpoints from the **HAR**, not guesses.
5. **Emit the companion files** for each screen: `<slug>.spec.ts` (from
   `assets/screen-test-template.spec.ts`, read-only, uses your own `storageState`) and
   `test-cases.md`.
6. **Roll up the shared `_api.md`** from every screen/feature's Data contract — dedupe
   endpoints, record base URLs + auth-by-location. Per-item specs link to it.
7. **Build `index.md`** linking all specs, grouped by section, one-line purpose each.
8. **Verify** — the `verifier` refutes: are all modes captured? is each control type real?
   is the backend model actually in a payload or guessed? are transitions observed or assumed?
   **is every documented endpoint actually in a HAR, or invented?**

## Replica / build mode (toggle)

Spec mode is **neutral by default** — "understand this product I'm authorized to inspect."
When the goal is to **rebuild** the product ("clone/replica," "consumed by builders"), turn
on **replica mode** (`/recon:spec ... replica`): additionally fill the **UI inventory**
section in each spec, marking every needed component **MISSING** (a foundation gap) vs.
existing/reused. Leave that section out entirely in neutral mode. Everything else (evidence,
observed-only, no-fabrication) is identical.

## Discipline notes specific to Spec

- **Decoded > rendered.** A control's real type and a feature's backend pipeline come from
  the app's own config/payload when it ships one — that's exact; the rendered DOM is the
  fallback and cross-check.
- **Per-mode controls.** Don't merge modes. "Change Colors" with 5 modes has (potentially) 5
  distinct control sets — spec them separately.
- **Observed transitions only.** A screen edge is real only if you triggered it. Mark
  assumed ones as unverified or leave them out.
- **Confirmed vs masked, always.** Never name a model from vibes; if the runtime hides it,
  the spec says "masked at runtime."
- **No fabricated states.** Only document an empty/error/quota state you actually saw or can
  cite; otherwise mark it "not observed."
- **Endpoints from the HAR, not vibes.** Every row in a Data contract / `_api.md` must trace
  to a captured request. A mutation you didn't trigger (read-only session) is marked
  *inferred* — never present an invented body as observed.
- **Tests stay read-only.** The generated `<slug>.spec.ts` asserts observed behavior with
  your own session. No real submits, created leads, or spent quota — same discipline as
  capture. Cases that need a mutation are listed in `test-cases.md` and flagged for sign-off.

## Output shape

Deliver the `specs/` tree (including `_api.md` and each screen's `<slug>.spec.ts` +
`test-cases.md`) and lead your reply with the `index.md` summary (counts + the section
breakdown), then link the individual files. Cross-link from the main `product-spec.md` (§2
catalog rows point at their feature/screen spec) and its §4 API section at `_api.md`.
