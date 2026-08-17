# Mode: Decode

Goal: recover **what the app is really doing** from what it ships to the browser —
framework data payloads, API responses, and embedded config — to reveal schemas, hidden
settings, and (for AI products) the **vendor/model/pipeline layer** the runtime tries to
hide.

Trigger phrases: "what's it built on", "decode the payloads", "what's the real schema",
"what models / vendors does it use", "reverse-engineer the config".

## The core idea

Modern web apps hydrate the client with a serialized copy of server state. That payload is
frequently **more complete and more honest than the rendered UI** — it can carry the full
tool/route manifest, feature flags, plan objects, and the definitions that name backend
pipelines even when the live UI masks them. Decode is the discipline of reading it
faithfully.

## What to produce

- **Stack fingerprint** — framework, auth provider, payments, CDN/image layer, analytics,
  realtime transport, error tracking. Evidence: response headers, script URLs, cookie
  names, network hosts.
- **Recovered schemas** — the shape of the objects the app hydrates with (tool definitions,
  config blocks, plan/subscription objects), decoded from the payload.
- **Vendor/model layer** (AI products) — the third-party foundation models / pipelines the
  product orchestrates, when they're named anywhere in the shipped definitions. Label each
  **confirmed** (named in a payload — cite the field) vs **masked** (not exposed at runtime
  — say so; do not guess the model).
- **Feature flags & entitlements** — booleans/plan-gates the client evaluates.

## Method

1. **Capture the payloads.** For each key route, fetch the framework data endpoint (see the
   framework table below) with your authorized session, plus the XHR/fetch traffic the app
   makes. Save raw to `.recon/traces/`.
2. **Decode by framework** with `scripts/decode.mjs` (auto-detects; handlers for SvelteKit,
   Next.js, Remix; generic fallback):

   | Framework | Where the data is | How to decode |
   |---|---|---|
   | **SvelteKit** | `<route>/__data.json` | Newline-delimited streamed chunks. Line 0 is a **devalue**-flattened node; streamed promises arrive as `{"type":"chunk","id":N,"data":[...]}`. `devalue.unflatten(node.data, {Promise: v => v})`. Fields may themselves be JSON strings → `JSON.parse` them. |
   | **Next.js** | `__NEXT_DATA__` script tag (Pages) or RSC flight payload / `.rsc` (App Router) | Pages: parse the `<script id="__NEXT_DATA__">` JSON. App Router: split the flight stream lines (`N:[...]`) and walk them. |
   | **Remix** | `window.__remixContext` | Read `loaderData` per route id from the hydration object. |
   | **Generic SPA** | XHR/fetch JSON + inline `<script>` state blobs | Diff API responses against the UI; look for a bootstrap/config endpoint. |

3. **Cross-check** decoded claims against the live UI — a definition in the payload is
   config; confirm the feature actually renders/behaves that way.
4. **Verify** with the refuter: is each named vendor/model actually in a payload field
   (quote it), or inferred? Downgrade anything inferred.

## Discipline notes specific to Decode

- **Confirmed vs masked vs inferred.** Only call a model/vendor "used" if it's named in a
  payload or a network call — and cite the field/endpoint. If the runtime hides it, say
  "masked at runtime." Never name a specific model from vibes.
- **Config ≠ execution.** A pipeline named in a tool definition proves the tool *references*
  it, not the exact runtime behavior or version. Say what the evidence supports.
- **Secrets in payloads.** Payloads and traces can contain tokens, signed URLs, and user
  data. Treat `.recon/traces/` as sensitive; never commit it; mask before sharing.
- **Don't over-read.** A feature flag being present ≠ the feature being live for all users.

## Output shape

Lead with the stack fingerprint and (for AI products) the confirmed-vs-masked model table.
Then recovered schemas and flags, each with the payload field or endpoint as evidence.
Persist to `.recon/notes/<product>-decode.md`.
