<!--
  recon DESIGN LANGUAGE — the observed visual system, described BEHAVIORALLY so a rebuild can
  feel right without copying anything. DO NOT lift logos, fonts, illustrations, or proprietary
  assets; DO record the *values* you measured (a hex, a font-family string, a radius) from
  computed styles (capture.mjs writes rec.design) + screenshots. Save to
  .recon/dossier/design-language.md. Rule: every token cites where it was measured.
-->

# Design language: <Product>

- **Captured:** <YYYY-MM-DD> · Source: computed styles (`.recon/screens.json` → `design`) + screenshots.
- **Note:** describes the *system*, not the assets. Reimplement equivalent tokens; never copy files.

## Color

| Token | Value (observed) | Used for | Evidence |
|---|---|---|---|
| Primary / brand | `#......` | primary buttons, links | `screens.json` design.buttonBg |
| Background | `#......` | page bg | design.bodyBg |
| Text | `#......` | body copy | design.bodyColor |
| Link | `#......` | links | design.linkColor |
| Accent / semantic | `#......` (success/warn/error) | | shot |

## Typography

| Role | Font family (observed) | Weight/size | Evidence |
|---|---|---|---|
| Body | `<family>` | | design.bodyFont |
| Headings | `<family>` | | design.headingFont |

<Note if it's a system stack vs a specific webfont; name the webfont only — don't ship it.>

## Shape, spacing & layout

- **Corner radius:** `<value>` (buttons/cards) — design.buttonRadius
- **Density / spacing:** <tight | comfortable> — <observed grid/gutter feel from shots>
- **Layout pattern:** <app shell: left nav + top bar + main | centered marketing | dashboard grid>
- **Elevation:** <flat | subtle shadows | borders> (from shots)

## Components (visual patterns)

| Pattern | Description | Where seen |
|---|---|---|
| Buttons | <filled/outline, sizes> | shot |
| Cards / tiles | | |
| Inputs / forms | | |
| Nav / tabs | | |
| Modals / drawers | | |

## Motion & interaction feel

<Observed transitions, loading skeletons vs spinners, hover/press feedback, animation speed.
From the journey video (`.recon/videos/`) — cite the clip.>

## Responsive behavior

| Breakpoint | What changes | Evidence |
|---|---|---|
| Desktop (1440) | <baseline> | `.recon/shots/<slug>.png` |
| Mobile (390) | <nav collapses to…, columns stack, …> | `.recon/shots/<slug>@mobile.png` |

## Unknown / not exposed

- <tokens you couldn't measure, dark mode not triggered, brand assets deliberately not copied>
