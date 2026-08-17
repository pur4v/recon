<!--
  recon SCREEN spec (build-ready). One screen → a folder: .recon/specs/screens/<slug>/
    screen.md         ← this file
    <slug>.spec.ts    ← executable Playwright check (assets/screen-test-template.spec.ts)
    test-cases.md     ← human-readable cases (assets/test-cases-template.md)
  Rules: a locator on every claim · layout/components from the DOM outline · transitions
  you actually TRIGGERED (not assumed) · data source from the decoded payload · every XHR
  the screen fires in the Data contract, cross-linked to the shared _api.md · no secrets.
-->

# Screen: <Screen name> — `<slug>`

- **Route:** `/route` · **Screenshot:** `.recon/shots/<slug>.png`
- **Auth:** <public | authed (your own session)> · **Shared API:** [`../../_api.md`](../../_api.md)
- **Tests:** [`<slug>.spec.ts`](<slug>.spec.ts) · [`test-cases.md`](test-cases.md)
- **Last verified:** <YYYY-MM-DD> · **Status:** <verified | partial | draft>

## Purpose

<What this screen is for, in 1–2 lines.>

## Layout regions

<From the DOM outline. Which regions are present and what each holds.>

| Region | Contents |
|---|---|
| header | |
| nav / sidebar | |
| main | |
| side panel | |
| footer | |

## Components

| Component | Type | Label / role | Action → destination | Evidence |
|---|---|---|---|---|
| <e.g. "New" button> | button | <aria-label> | → `/route` (observed) | shot / DOM |
| <tabs> | tablist | <tab names> | switches mode | |
| <input> | input/textarea/select | <placeholder> | | |

## Data shown

<What the screen renders (lists, cards, counters) and its SOURCE — decoded payload field or
API endpoint. Cite it.>

## Data contract (from the network trace / XHR)

<Every request this screen fires, read from the HAR / network capture. `METHOD path` +
request + response shape + **what it changes on screen** (the cause→effect map: which call
repaints which region). Reference the shared [`_api.md`](../../_api.md) for full shapes; keep
the per-screen slice here. Mark inferred bodies (e.g. a mutation you didn't trigger in a
read-only session) as inferred — never invent a payload.>

| Method + path | When it fires | Request (shape) | Response (shape) | **Changes on screen** | Evidence |
|---|---|---|---|---|---|
| `GET /api/...` | on load | — | `{ ... }` | populates the <list/grid> | HAR `.recon/traces/<slug>/network.har` |
| `PUT /api/...` | on <action> (debounced) | `{ ... }` *(inferred)* | `{ ... }` | updates <region>; toast `<copy>` | HAR / inferred |

- **Auth:** <cookie / bearer / none — reference location, never the value>.
- **Base(s):** <api host(s) this screen talks to>.
- **Analytics fired here:** <event(s) from `.recon/screens.json` → analytics — or "none observed">.

## Copy (exact strings)

<Key microcopy on this screen — CTAs, empty/error/success text — quoted verbatim. Full set in
[`../../../dossier/copy-inventory.md`](../../../dossier/copy-inventory.md).>

## Responsive

<What changes desktop → mobile (nav collapse, columns stack). Evidence: `.recon/shots/<slug>.png`
+ `.recon/shots/<slug>@mobile.png` (capture with `--mobile`).>

## States

| State | Behavior | Evidence |
|---|---|---|
| default / populated | | shot |
| empty | | |
| loading | | |
| error | | |
| auth-gated | | |
| paywall / quota | | |

*(Mark any state "not observed" rather than inventing it.)*

## Transitions

- **In (how you arrive):**
  - from [<screen>](<slug>.md) via <trigger> — observed
- **Out (where actions lead):**
  - <action> → [<screen>](<slug>.md) — observed
  - <action> → ((gate: auth / paywall / quota)) — observed

*(Draw an edge only where you actually triggered the transition.)*

## Gates

<auth / email-verify / paywall / quota guarding this screen or its actions, with locator.>

<!-- REPLICA/BUILD MODE (optional). Include this section only when the goal is to REBUILD
     the screen (spec is "consumed by builders"). Omit it for neutral understanding. -->
## UI inventory — replica build (optional)

> Include only in replica/build mode. Components this screen needs; mark **MISSING** any not
> yet in the target component library — a foundation gap, not the screen builder's job.

| Component | Role | Status |
|---|---|---|
| `<ComponentName>` | <what it is> | MISSING / exists / reused from `<shell>` |

## Unknown / not exposed / inferred

- <state not reachable with this account, masked data source, assumed edge — labelled>

## Recon notes

- **Trace dir:** `.recon/traces/<slug>/` (HAR, DOM, console, screenshots)
- **Captured:** <YYYY-MM-DD>, <viewport(s)> · **Session:** <your own authed account | public>
- **States triggered vs not reachable:** <which states you actually forced vs. inferred>
