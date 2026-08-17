<!-- FICTIONAL worked example. See ../../../README.md. Build-ready screen spec. -->

# Screen: Create — `create`

- **Route:** `/create` · **Screenshot:** `.recon/shots/create.png`
- **Auth:** authed (your own session) · **Shared API:** [`../../_api.md`](../../_api.md)
- **Tests:** [`create.spec.ts`](create.spec.ts) · [`test-cases.md`](test-cases.md)
- **Last verified:** 2026-02-01 · **Status:** verified (illustrative)

## Purpose

The workspace hub: pick a Create tool, run it, and see results — the screen where the aha
moment happens.

## Layout regions

| Region | Contents |
|---|---|
| header | logo, spark balance, account menu |
| nav / sidebar | section switcher (Create / Brand Kit / Library / Campaigns) |
| main | tool grid → selected tool's form + result grid |
| side panel | run history for the session |
| footer | — |

## Components

| Component | Type | Label / role | Action → destination | Evidence |
|---|---|---|---|---|
| Tool cards | button grid | 8 Create tools | → `/create/<tool>` (observed) | DOM |
| Section tabs | tablist | Create/Brand/Library/Campaigns | switch section | DOM |
| Spark balance | text | "482 sparks" | → `/billing` on click (observed) | shot |
| Result grid | cards | outputs | → asset detail (observed) | shot |

## Data shown

Tool manifest (from `/create/__data.json` → `tool.modes[]`); spark balance (from
`/billing/__data.json` plan object); session history (WS).

## Data contract (from the network trace / XHR)

Full shapes in [`../../_api.md`](../../_api.md). Screen slice:

| Method + path | When it fires | Request (shape) | Response (shape) | Changes on screen | Evidence |
|---|---|---|---|---|---|
| `GET /api/v1/me` | on load | — | `{id, plan, sparks}` | fills spark balance in header | HAR `create/network.har` |
| `GET /create/__data.json` | on load | — | devalue → `{tools[]}` | renders the tool-card grid | HAR |
| `GET /billing/__data.json` | on load | — | `{sparks, unitCosts}` | drives the paywall-vs-run gate | HAR |

- **Auth:** cookie `nimbus_sess` (referenced by name).
- **Base:** `studio.nimbus.example/api/v1`.
- **Analytics fired here:** `screen_viewed {screen:"create"}` (Segment) — see
  [`../../../dossier/analytics-events.md`](../../../dossier/analytics-events.md).

## Copy (exact strings)

- Empty state: `Run your first render` · Spark balance: `482 sparks` · Paywall CTA:
  `Upgrade to keep creating`. Full set: [`../../../dossier/copy-inventory.md`](../../../dossier/copy-inventory.md).

## Responsive

Desktop: sidebar + tool grid side by side. Mobile (390): sidebar collapses to a hamburger,
tool grid stacks to one column. Evidence: `.recon/shots/create.png` + `create@mobile.png`.

## States

| State | Behavior | Evidence |
|---|---|---|
| default / populated | tool grid | shot |
| empty | no history yet → "Run your first render" | shot |
| loading | skeleton cards | shot |
| error | banner | not observed |
| auth-gated | redirects to OAuth if unauthed | observed |
| paywall / quota | 0 sparks → upgrade modal on run | shot |

## Transitions

- **In (how you arrive):**
  - from `/onboarding` via "Start creating" — observed
  - from landing via OAuth → default post-login route — observed
- **Out (where actions lead):**
  - tool card → `/create/<tool>` — observed
  - spark balance → `/billing` — observed
  - run at 0 sparks → ((gate: paywall modal)) — observed

## Gates

Auth gate (OAuth) on the whole screen; quota gate (paywall modal) on the run action.

## Unknown / not exposed / inferred

- Error-banner copy **not observed** (couldn't force a server error safely).

## Recon notes

- **Trace dir:** `.recon/traces/create/` (HAR, DOM, console, screenshots)
- **Captured:** 2026-02-01, desktop 1440×1000 + mobile 390 (`--mobile`) · **Session:** owner-operated authed account
- **States triggered vs not reachable:** default/empty/loading/auth-gate/paywall triggered;
  server-error **not** forced (would need to break the backend).
