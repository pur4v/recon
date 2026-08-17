<!--
  recon FEATURE spec (build-ready). One file per feature: .recon/specs/features/<slug>.md
  Rules: a locator on every non-trivial claim · control types & backend from the DECODED
  config where possible · per-mode controls (don't merge) · confirmed vs masked · no secrets.
-->

# <Feature name>

- **Section:** <vertical / nav group> · **Route(s):** `/route`
- **Lives on screen(s):** [<screen>](../screens/<slug>.md)
- **Screenshot:** `.recon/shots/<slug>.png`
- **Last verified:** <YYYY-MM-DD> · **Status:** <verified | partial | draft>

## Purpose

<Job-to-be-done in 1–2 lines: what a user hires this feature for.>

## Modes / variants

<If single-mode, say "1 mode." Otherwise list each mode/tab — they often have DIFFERENT
control sets, so spec controls per mode below.>

| Mode | What it does | Distinct from others by |
|---|---|---|
| <mode> | <one line> | <the key difference> |

## Controls (per mode)

### Mode: <name>

| Control | Type | Required | Default | Range / options | Config ref | Evidence |
|---|---|---|---|---|---|---|
| <label> | upload / prompt / dropdown / slider / color / mask / multi-select | yes/no | <default> | <min–max / list> | `value.reference` | payload field / shot |

## Inputs → outputs

- **Inputs:** <what the user provides>
- **Outputs:** <type: image / video / text / vector> · **count (`num_outputs`):** <n> ·
  <any post-processing / upscaling>

## Backend model / pipeline

| Step | Backend | Label | Evidence |
|---|---|---|---|
| <action> | <pipeline / vendor / model, or "—"> | **confirmed** / **masked** | `bundle.actions[].id` / "hidden at runtime" |

## Data contract (from the network trace / XHR)

<The request(s) this feature fires when run — read from the HAR. `METHOD path` + request +
response shape. Full shapes live in the shared [`../_api.md`](../_api.md); keep the
feature's slice here. Mark inferred bodies as inferred.>

| Method + path | When it fires | Request (shape) | Response (shape) | Evidence |
|---|---|---|---|---|
| `POST /api/...` | on run | `{ ... }` | `{ jobId, ... }` | HAR `.recon/traces/<slug>/network.har` |

## Cost / credits

<Metered unit for this action (e.g. 1 credit/image, 4/video), or "not metered / unknown.">

## States

| State | Behavior | Evidence |
|---|---|---|
| empty | | shot |
| loading / in-progress | | |
| success | | |
| error | | |
| quota / paywall blocked | | |

*(Mark any state "not observed" rather than inventing it.)*

## Constraints / validation

<file types, size limits, prompt limits, plan gating, rate limits.>

<!-- REPLICA/BUILD MODE (optional). Include only when the goal is to REBUILD the feature. -->
## UI inventory — replica build (optional)

> Include only in replica/build mode. Components this feature needs; mark **MISSING** any not
> in the target library (a foundation gap).

| Component | Role | Status |
|---|---|---|
| `<ComponentName>` | <what it is> | MISSING / exists |

## Unknown / not exposed / inferred

- <masked model, gated mode, undocumented limit — labelled>
