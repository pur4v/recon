<div align="center">

# recon 🛰️

**Reconnoiter a live web product you're authorized to inspect — and bring back _verified_ intel.**

[![CI](https://github.com/pur4v/recon/actions/workflows/ci.yml/badge.svg)](https://github.com/pur4v/recon/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Skill](https://img.shields.io/badge/Claude-Agent%20Skill-8A63D2)](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
[![Claude Code Plugin](https://img.shields.io/badge/Claude%20Code-Plugin-000000)](https://docs.claude.com/en/docs/claude-code)

</div>

A scout goes ahead into unknown territory and reports back with reliable information.
`recon` does that for a **live web product**: point Claude at a product you own or are
authorized to test, and it drives the real app **headless with Playwright**, captures hard
evidence (DOM, network, screenshots, decoded payloads), and builds trustworthy,
**evidence-backed** understanding — a feature catalog, a user journey & funnel, a decoded
model layer, a competitive landscape, a battlecard — plus a knowledge base so the next
session starts warm.

Built for the moment you have to answer, quickly and correctly: *what does this product
actually do, how is it built, who is it for, and how do we beat it?*

> ### ⚠️ Authorized, owner-operated recon only
> recon inspects **running products**. Use it only against a product you **own or are
> explicitly authorized to test**, logged in as **your own** account. It never bypasses
> auth, reuses harvested credentials, or does anything destructive without per-run sign-off.
> Competitors are researched from **public sources only** — recon never logs into someone
> else's app. If you can't name your authorization, don't run it.

---

## What it does — six modes

| Mode | Ask it… | You get |
|---|---|---|
| 🗺️ **Survey** | "map this product / catalog the features" | Feature & IA catalog: every screen/tool, navigation map, control vocabulary, app-shell diagram |
| 📄 **Spec** | "spec out each feature / screen" | **Build-ready spec docs — per feature and per screen**: controls, modes, backend model, **XHR/API data contract (from the HAR) + shared `_api.md`**, states, transitions, plus an executable read-only `<slug>.spec.ts` + `test-cases.md`; optional replica/build mode |
| 🚶 **Journey** | "map the user journey / funnel" | First-touch→activation→habit journey, screen-transition graph, funnel + gates |
| 🔎 **Decode** | "what's it built on / what models does it use" | Decoded framework/network payloads → schemas, config, **de-masked vendor/model layer** |
| 🎯 **Position** | "who's it for / how's it priced" | ICP & segments, pricing & packaging, credit/quota economics, GTM funnel |
| ⚔️ **Compete** | "competitor landscape / battlecard" | Named-competitor landscape, parity checklist, one-page sales battlecard |

Modes chain: survey the surface, spec each item, walk the journey, decode what's under it,
work out positioning, then build the competitive view. **Survey** is the *catalog* (one row
per feature); **Spec** is the *dossier* (one deep file per feature and per screen).

## What makes the output trustworthy — five disciplines

1. **Authorized & owner-operated** — your own account; no auth bypass; nothing destructive without sign-off. (Outranks the rest.)
2. **Evidence or it didn't happen** — every claim carries a locator (URL+selector / endpoint / screenshot / payload field), and everything is labelled: *observed vs inferred*, *live vs marketing*, *confirmed vs masked*. Never fabricated.
3. **Parallel fan-out** — one sub-agent per surface / vertical / competitor, run concurrently, then synthesized.
4. **Adversarial verify pass** — findings are re-checked (and refuted where possible) before you see them: real counts, current prices, model attributions actually in the payload.
5. **Credential- & secret-safe** — session state lives in a gitignored `.recon/.auth/` and is never committed; captures are treated as sensitive.

## How recon works

```
you: "/recon:decode what models does studio.example use?"
                │
                ▼
        ┌───────────────┐   reads .recon/notes first (start warm)
        │  recon skill  │   drives the app headless via Playwright (your session)
        └───────┬───────┘
                │  fan out — one worker per surface, concurrently
     ┌──────────┼──────────┐
     ▼          ▼          ▼
 surface-explorer   …    (agents/surface-explorer.md)
     │          │          │
     └──────────┴────┬─────┘  synthesize into the mode's artifact
                     ▼
             ┌───────────────┐
             │   verifier    │  adversarial pass — refute each claim
             └───────┬───────┘  (agents/verifier.md)
                     │  mask secrets · label masked/inferred · keep locators
                     ▼
        answer  +  updated .recon knowledge base
```

## Install

recon ships **two ways** from this one repo.

### A) As a Claude Code plugin (recommended)

Installs the skill *plus* the `/recon:*` slash commands and the fan-out agents. Run these
**one at a time**:

```
/plugin marketplace add pur4v/recon
```
```
/plugin install recon
```

Then:

```
/recon:setup     https://app.example.com   (log in once, save your session)
/recon:survey    catalog the product
/recon:spec      build-ready spec per feature & per screen
/recon:journey   map the funnel
/recon:decode    what's under the hood
/recon:position  ICP & pricing
/recon:compete   vs Acme, Globex
```

### B) As a standalone Agent Skill

```bash
git clone https://github.com/pur4v/recon /tmp/recon
cp -r /tmp/recon/skills/recon ~/.claude/skills/recon
```

Or copy `skills/recon` into a project's `.claude/skills/`. Claude invokes it automatically
when a request matches the triggers in `SKILL.md`, or ask for it by name.

## Prerequisites (for the capture scripts)

The Playwright scripts are real and runnable:

```bash
npm install           # installs playwright + devalue
npx playwright install chromium
npm run auth -- https://app.example.com    # log in once (headed), saves .recon/.auth/state.json
npm run capture -- /,/create,/library      # headless DOM+network+screenshots -> .recon/
npm run decode  -- https://app.example.com/create   # decode the framework payload
```

## Repo layout

```
recon/
├── .claude-plugin/          # plugin.json + marketplace.json (plugin install)
├── commands/                # /recon:setup :survey :spec :journey :decode :position :compete
├── agents/
│   ├── surface-explorer.md  # per-surface fan-out worker
│   └── verifier.md          # adversarial refuter for the verify pass
├── skills/recon/            # the skill itself (installable on its own)
│   ├── SKILL.md             # authorization, 6 modes, 5 disciplines, workflow
│   ├── reference/           # mode-*.md (survey · spec · journey · decode · position · compete) · fan-out · playwright · deliverables · knowledge-base
│   ├── scripts/             # auth-setup.mjs · capture.mjs (DOM+HAR) · decode.mjs · scan_secrets.sh
│   └── assets/              # product-spec / feature-spec / screen-spec / api-contract / screen-test / test-cases / competitive-analysis / battlecard / kb templates
├── examples/nimbus-studio/  # a fully fictional worked example — every mode, incl. specs/
└── package.json             # playwright + devalue
```

## Persistent knowledge base

Findings and raw captures accumulate in a **`.recon/`** directory in your working directory
— notes, traces, screenshots, diagrams, and deliverables — so re-analysis is incremental.
`.recon/` is **gitignored**: it holds session state and captures that must never be
committed. See [`skills/recon/reference/knowledge-base.md`](skills/recon/reference/knowledge-base.md).

## Example

See [`examples/nimbus-studio/`](examples/nimbus-studio/) for a worked run of every mode
against a small, **entirely fictional** product (no real systems, secrets, or competitors).

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md). Security & data-handling: [SECURITY.md](SECURITY.md).

## License

MIT — see [LICENSE](LICENSE).
