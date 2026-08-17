# Contributing to recon

Thanks for wanting to help. recon is a small, focused skill — the goal is to keep it sharp,
not sprawling. Contributions that make the six modes more *trustworthy* (or the capture
scripts more robust) are especially welcome.

## Ground rules

1. **Authorized-recon framing is non-negotiable.** recon drives live products. Every mode,
   doc, and script must keep the authorization discipline front and center: owner-operated /
   explicitly authorized target, your own account, no auth bypass, nothing destructive
   without per-run sign-off, competitors researched from public sources only. Don't add a
   feature that erodes this.
2. **Never commit real captures, secrets, or session state.** This is a public repo. All
   examples must be fictional (see `examples/nimbus-studio/`). `.recon/`, `.auth/`, and
   `*storageState*` are gitignored — keep it that way. Run the scan before you push:
   ```bash
   skills/recon/scripts/scan_secrets.sh .
   ```
3. **Keep the disciplines intact.** Every change to a mode should preserve: parallel
   fan-out, the adversarial verify pass, locator-backed evidence, the observed/inferred and
   confirmed/masked labelling, and credential safety. These are the point of the project.
4. **Progressive disclosure.** `SKILL.md` stays lean; depth goes in
   `skills/recon/reference/`. Don't inline a long procedure into `SKILL.md` — add or extend
   a reference file and point to it.

## Project layout

```
.claude-plugin/    plugin.json + marketplace.json
commands/          /recon:setup :survey :journey :decode :position :compete
agents/            surface-explorer (fan-out) + verifier (adversarial)
skills/recon/      the skill — SKILL.md, reference/, scripts/, assets/
examples/          fictional worked example
```

## Making a change

1. Fork and branch (`feat/…`, `fix/…`, `docs/…`).
2. Make the change. If you touch a `.mjs` script, keep it dependency-light (playwright +
   devalue only) and read-only by default. If you touch `scan_secrets.sh`, run `shellcheck`.
3. If you change a mode's behavior, update the matching `reference/mode-*.md` and, if
   user-facing, the `commands/*.md` and `README.md`.
4. Add a line to `CHANGELOG.md` under **Unreleased**.
5. Open a PR using the template. Describe what changed and how you verified it.

## Style

- Markdown, wrapped ~100 cols, tables/diagrams over walls of prose.
- Be concrete. If you claim recon does something, show the reference file that makes it so.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
