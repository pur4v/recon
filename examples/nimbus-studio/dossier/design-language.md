<!-- FICTIONAL worked example. See ../../README.md. Design language (invented values). -->

# Design language: Nimbus Studio

- **Captured:** 2026-02-01 · Source: computed styles (`screens.json` → `design`) + screenshots.
- **Note:** describes the system; assets (logo/webfont files) are **not** copied.

## Color

| Token | Value (observed) | Used for | Evidence |
|---|---|---|---|
| Primary / brand | `#5b5bd6` | primary buttons, links | design.buttonBg |
| Background | `#ffffff` | page bg | design.bodyBg |
| Text | `#1c1c28` | body copy | design.bodyColor |
| Accent (success) | `#0ea472` | render-complete toast | shot |

## Typography

| Role | Font family (observed) | Evidence |
|---|---|---|
| Body | `Inter, system-ui, sans-serif` | design.bodyFont |
| Headings | `Inter, system-ui` (600–700) | design.headingFont |

Specific webfont named (`Inter`) but its files are the product's asset — reimplement with the
open equivalent, don't ship theirs.

## Shape, spacing & layout

- **Corner radius:** `10px` (buttons/cards) — design.buttonRadius
- **Density:** comfortable; 24px gutters on the tool grid.
- **Layout pattern:** app shell — left section nav + top bar (brand, sparks, account) + main.
- **Elevation:** subtle 1px borders + soft shadow on cards.

## Components (visual patterns)

| Pattern | Description | Where seen |
|---|---|---|
| Buttons | filled primary, ghost secondary | create shot |
| Cards | tool cards + result cards, rounded, hover lift | create shot |
| Nav | vertical section switcher + tablist | create shot |

## Motion & interaction feel

Skeleton cards while loading; result cards fade in as the WS streams progress. From the
walkthrough video `.recon/videos/activation/`.

## Responsive behavior

| Breakpoint | What changes | Evidence |
|---|---|---|
| Desktop (1440) | sidebar + grid side by side | `.recon/shots/create.png` |
| Mobile (390) | sidebar → hamburger; grid → 1 column | `.recon/shots/create@mobile.png` |

## Unknown / not exposed

- Dark mode not triggered with this account; brand logo/illustration assets deliberately not copied.
