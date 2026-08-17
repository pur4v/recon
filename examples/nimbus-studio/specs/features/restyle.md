<!-- FICTIONAL worked example. See ../../README.md. Build-ready feature spec. -->

# Restyle

- **Section:** Create · **Route(s):** `/create/restyle`
- **Lives on screen(s):** [create](../screens/create/screen.md) · **Shared API:** [`../_api.md`](../_api.md)
- **Screenshot:** `.recon/shots/create_restyle.png`
- **Last verified:** 2026-02-01 · **Status:** verified (illustrative)

## Purpose

Restyle an uploaded image to match a saved Brand Kit — a marketer drops in a photo and gets
an on-brand variant.

## Modes / variants

2 modes; the "Strict" mode locks composition, "Loose" mode allows re-composition.

| Mode | What it does | Distinct from others by |
|---|---|---|
| Strict | recolor/retexture to brand, keep layout | composition preserved |
| Loose | free reinterpretation to brand | composition may change |

## Controls (per mode)

### Mode: Strict

| Control | Type | Required | Default | Range / options | Config ref | Evidence |
|---|---|---|---|---|---|---|
| Source image | upload | yes | — | png/jpg ≤ 20MB | `value.reference=src` | `tool.modes[0]` |
| Brand Kit | dropdown | yes | active kit | user's kits | `value.reference=kit` | payload |
| Strength | slider | no | 0.6 | 0.1–1.0 | `params.min/max` | payload |

### Mode: Loose

| Control | Type | Required | Default | Range / options | Config ref | Evidence |
|---|---|---|---|---|---|---|
| Source image | upload | yes | — | png/jpg ≤ 20MB | `value.reference=src` | `tool.modes[1]` |
| Brand Kit | dropdown | yes | active kit | user's kits | `value.reference=kit` | payload |
| Prompt | prompt | no | — | free text | `value.reference=hint` | payload |

## Inputs → outputs

- **Inputs:** one source image + a Brand Kit (+ strength or prompt by mode).
- **Outputs:** image · **count (`num_outputs`):** 4 · optional 2× upscale downstream.

## Backend model / pipeline

| Step | Backend | Label | Evidence |
|---|---|---|---|
| restyle | "AuroraDiffuse v3" | **confirmed** | `tool.modes[0].actions[0].id` |

## Data contract (from the network trace / XHR)

Full shapes in [`../_api.md`](../_api.md). Feature slice:

| Method + path | When it fires | Request (shape) | Response (shape) | Evidence |
|---|---|---|---|---|
| `POST /api/v1/render` | on Run | `{tool:"restyle", mode, reference:{src,kit}, strength}` | `{jobId}` | HAR `create_restyle/network.har` |
| `WS /realtime` | during render | `{subscribe:jobId}` | progress → `{status,outputs[]}` | net trace |

## Cost / credits

1 spark per output image (4 sparks for a default run of 4).

## States

| State | Behavior | Evidence |
|---|---|---|
| empty | dropzone + "Upload to start" | shot |
| loading | progress bar over WS | net trace |
| success | 2×2 result grid | shot |
| error | inline toast, sparks refunded | shot |
| quota blocked | upgrade modal | shot |

## Constraints / validation

png/jpg only, ≤ 20MB; Brand Kit required; Loose-mode prompt ≤ 300 chars.

## Unknown / not exposed / inferred

- Whether strength maps linearly to the pipeline param — **inferred**, not confirmed.
