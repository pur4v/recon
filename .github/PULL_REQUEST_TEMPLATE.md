## What & why

<!-- What does this change and why? Link any related issue. -->

## Type

- [ ] Fix
- [ ] Feature / mode change
- [ ] Docs / reference
- [ ] Scripts (capture / decode / scan)
- [ ] Packaging (plugin / commands / agents / CI)

## Checklist

- [ ] No real secrets, captures, or session state — examples remain fictional
- [ ] `.recon/`, `.auth/`, `*storageState*` stay gitignored (nothing of the sort committed)
- [ ] Ran `skills/recon/scripts/scan_secrets.sh .` and reviewed the output
- [ ] `shellcheck` passes if I touched `scan_secrets.sh`; `node --check` passes for `.mjs`
- [ ] The disciplines are preserved (authorized/owner-operated, locator evidence,
      observed-vs-inferred + confirmed-vs-masked labelling, fan-out, adversarial verify,
      credential safety)
- [ ] Scripts stay read-only by default (nothing destructive / no quota spend without sign-off)
- [ ] Updated the matching `reference/mode-*.md` / `commands/*.md` / `README.md` if behavior changed
- [ ] Added a `CHANGELOG.md` entry under **Unreleased**

## How I verified
