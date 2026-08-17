# Security, authorization & data handling

recon is a Claude skill/plugin that reconnoiters **live web products**. That makes it more
sensitive than a code-reading tool: it authenticates to a running app and captures real
traffic. This document covers authorized use, how it treats credentials and captures, and
how to report a problem.

## Authorized use only

- **Owner-operated or explicitly authorized targets.** Only run recon against a product you
  own, operate, or have written authorization to assess.
- **Your own account.** Log in as yourself or a sanctioned test account. recon never bypasses
  authentication, reuses harvested/leaked credentials, brute-forces, or evades rate limits or
  bot controls.
- **Non-destructive by default.** The capture scripts navigate, fetch, and screenshot —
  they click nothing that creates data, sends a message, or spends paid credits. Any such
  action requires explicit per-run authorization.
- **Competitors: public sources only.** recon drives only the product you're authorized to
  test. Competitor research uses public marketing/docs — never logging into or probing a
  competitor's app.

If a request would cross these lines, recon is designed to stop and say so.

## How recon treats credentials and captures

- **Sessions stay local and gitignored.** `auth-setup.mjs` saves your session
  `storageState` to `.recon/.auth/state.json`. recon never handles your password (you type
  it into the real login) and never transmits the session anywhere beyond wherever your
  Claude client already sends context. `.recon/` (state, traces, screenshots) is gitignored.
- **Captures are sensitive.** Framework payloads and network traces can contain tokens,
  signed URLs, and user data. Treat `.recon/traces/` as secret; never commit it.
- **Masks by default.** Any output meant for sharing has secret/session values masked. recon
  shows enough to locate something, never the full value.
- **No bundled credentials.** Nothing in this repo contains real secrets. The worked example
  under `examples/` is entirely fictional.

## The secret scanner

`skills/recon/scripts/scan_secrets.sh` is a heuristic backstop for the real defense
(`.gitignore`). Run it before committing or sharing. Masking a report does **not** remediate
a leak: if a real secret or session lands in git, rotate it and scrub history
(e.g. `git filter-repo`). Assume anything committed to a shared/public repo is compromised.

## Reporting a vulnerability

If you find a security issue in recon itself (for example, a code path that could exfiltrate
captures or leak session state into shared output), please **do not open a public issue**.
Open a [private security advisory](https://github.com/pur4v/recon/security/advisories/new)
on the repository, or contact the maintainer directly. Include what you observed, steps to
reproduce, and the impact you're concerned about.
