<!-- FICTIONAL worked example. See ./README.md. Locators point at invented URLs. -->

# Nimbus Studio — product spec (reverse-engineered)

- **Last verified:** 2026-02-01
- **Surfaces:** `www.nimbus.example` (marketing) · `studio.nimbus.example` (app)
- **Authorization:** owner-operated (fictional example)
- **Status:** verified (illustrative)

## TL;DR

Nimbus Studio is a SvelteKit SPA that lets marketing teams generate on-brand images and
short videos from prompts and brand kits. It orchestrates external models (it owns none),
meters usage in "sparks," and gates teams/SSO behind an Enterprise plan. **14 live tools**
across 3 sections; a 4th section ("Campaigns") is coming-soon.

## 1. Information architecture

```
Nimbus Studio (studio.nimbus.example)
├── Create            /create      (8 tools)
├── Brand Kit         /brand       (3 tools)
├── Library           /library     (3 tools)
└── Campaigns         /campaigns   (coming-soon — empty grid)   [stub]
```
SVG: `.recon/diagrams/nimbus-ia.svg`

## 2. Feature / tool catalog

**14 unique tools across 3 live sections** (counted from the decoded tool manifest at
`/create/__data.json`; "Campaigns" excluded as a stub).

| Section | Feature | What it does | Route | Controls | Modes | Evidence |
|---|---|---|---|---|---|---|
| Create | Text→Image | prompt to image | `/create/image` | prompt, dropdown, slider | 1 | shot `create_image.png` |
| Create | Restyle | restyle an upload to a brand kit | `/create/restyle` | upload, dropdown | 2 | payload `tool.modes[]` |
| Brand Kit | Train Brand Model | fine-tune from ≤10 refs | `/brand/train` | multi-upload | 1 | shot `brand_train.png` |
| Library | Upscale | 2×/4× enhance | `/library/upscale` | upload, dropdown | 1 | payload `tool.id` |

*(abridged — full 14 rows in the real deliverable)*

Per-feature and per-screen build-ready dossiers (Spec mode) live under `specs/` — e.g.
[`specs/features/restyle.md`](specs/features/restyle.md) and
[`specs/screens/create/screen.md`](specs/screens/create/screen.md) (with its `.spec.ts` +
`test-cases.md`), a shared API contract at [`specs/_api.md`](specs/_api.md), indexed by
`specs/index.md`.

## 3. User journey & funnel

```
[ www landing ] --Get started--> ((OAuth login)) --new user--> [ /onboarding ]
      |                                                              | pick brand colors
      v                                                              v
[ pricing ]                                             [ /create ] --first render--> ✷ AHA (spark spent)
```
Aha moment: first successful render on `/create` — **3 steps** from landing (structural
funnel; drop-off not measured — no access to their analytics).
SVG: `.recon/diagrams/nimbus-journey.svg`

## 4. Stack & model layer

- **Framework:** SvelteKit (`data-sveltekit` attrs; `/__data.json` endpoints).
  **Auth:** OAuth (cookie `nimbus_sess`). **Images/CDN:** `cdn.nimbus.example`.
  **Analytics:** a GA-style beacon. *(all observed in network trace `create.net`)*
- **Model layer** (from `bundle` blocks in the decoded tool manifest):

  | Capability | Backend | Label |
  |---|---|---|
  | Text→Image | "AuroraDiffuse v3" | **confirmed** (`tool.modes[0].actions[0].id`) |
  | Video | — | **masked** (runtime hides model id; WS payload obfuscated) |
  | Upscale | "ClearPix" | **confirmed** (payload field) |

## 5. Pricing & economics

Free (20 sparks, one-time) · Pro $29/mo (500 sparks) · Enterprise (contact sales — SSO,
teams, brand models). Unit: **1 spark/image, 5 sparks/video** (decoded from the billing
plan object `/billing/__data.json`).

## Glossary

- **Spark** — Nimbus's usage credit. **Brand Kit** — stored brand colors/fonts/logos.

## Unknown / not exposed / inferred

- Video model **masked** at runtime — not named anywhere in a payload.
- Enterprise pricing **demo-gated** — not public; not guessed.
- Funnel drop-off **inferred structural**, not measured.
