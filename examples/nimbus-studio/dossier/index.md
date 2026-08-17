<!-- FICTIONAL worked example. See ../../README.md. Product dossier (invented). -->

# Product dossier: Nimbus Studio — generative-AI design tool for marketing teams

- **Captured:** 2026-02-01 · **Session:** owner-operated authed account · **Surfaces:** `www.nimbus.example`, `studio.nimbus.example`
- **Depth:** Standard · **Status:** verified (illustrative)
- **Authorization:** fictional example — owner-operated.

## 1. TL;DR

Nimbus Studio turns a brand kit + a reference image into on-brand marketing renders. It's a
SvelteKit SPA behind OAuth, orchestrates third-party image/video models it doesn't own, and
meters usage in "sparks" (1/image, 5/video). Value lands on the first render on `/create`.

## 2. What it does (feature map)

→ **Full survey:** [`../product-spec.md`](../product-spec.md)

| Section | Key features | Depth doc |
|---|---|---|
| Create | 8 tools incl. Restyle | [restyle](../specs/features/restyle.md) · [create screen](../specs/screens/create/screen.md) |
| Brand Kit / Library / Campaigns | asset + brand management | (see survey) |

## 3. Screens

| Screen | Route | Spec | Shot | What changes it |
|---|---|---|---|---|
| Create | `/create` | [screen.md](../specs/screens/create/screen.md) | `.recon/shots/create.png` | `GET /create/__data.json` → tool grid; `POST /api/v1/render` → result card |

## 4. User journey

- **Aha moment:** first completed render — 3 steps from login.
- **Walkthrough video:** `.recon/videos/activation/*.webm` · **Storyboard:** `.recon/shots/journey/`
- **Transition graph:** `.recon/diagrams/journey-graph.svg`

## 5. Data & backend

- **Shared API:** [`../specs/_api.md`](../specs/_api.md) (cause→effect column per endpoint).
- **Model layer:** image model **confirmed** in `tool.modes[].pipeline`; video model **masked**.

## 6. Design language → [`design-language.md`](design-language.md)
## 7. Copy & content → [`copy-inventory.md`](copy-inventory.md)
## 8. Analytics → [`analytics-events.md`](analytics-events.md)

## 9. Positioning & pricing

Mid-market marketing teams; usage-metered sparks. → [`../competitive-analysis.md`](../competitive-analysis.md) · [`../battlecard.md`](../battlecard.md)

## 10. If we were to build this

Core = the Create canvas + render pipeline + spark metering; the rest (Library, Campaigns) is
CRUD around it. Foundation needs: OAuth, a jobs/WS progress channel, a metering ledger.

## 11. Unknown / not exposed / inferred

- Video render endpoint masked (obfuscated WS); real render not triggered (would spend sparks);
  funnel is structural (no access to their analytics).
