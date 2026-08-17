---
description: Decode an authorized web app's framework/network payloads — recover schemas, config, and the vendor/model layer.
argument-hint: [product URL or name — defaults to the configured target]
---

Run **recon** in **Decode** mode against: $ARGUMENTS

Confirm authorization first. Goal: recover **what the app is really doing** from what it
ships to the browser — framework data payloads, API responses, and embedded config — to
reveal schemas, feature flags, plan objects, and (for AI products) the vendor/model/pipeline
layer the runtime masks.

Capture the payloads with your authorized session and decode them with
`skills/recon/scripts/decode.mjs` (auto-detects SvelteKit / Next.js / Remix; generic
fallback). Fingerprint the stack from headers, script hosts, and cookies. Label every
vendor/model **confirmed** (named in a payload — quote the field) vs **masked** (not exposed
— say so, don't guess). config ≠ execution: a pipeline named in a definition proves a
reference, not exact runtime behavior. Treat traces as sensitive; never commit `.recon/`.

Load `skills/recon/reference/mode-decode.md` (framework decode table) and `playwright.md`
first. Verify model attributions with the `verifier` agent. Offer to persist to
`.recon/notes/<product>-decode.md`.
