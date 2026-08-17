<!--
  recon ANALYTICS / EVENTS — what the product measures about its own users. Read from the
  network trace (capture.mjs flags known beacons in rec.analytics; the HAR has the payloads).
  The product's instrumentation is a strong, observable signal of what it thinks matters.
  Save to .recon/dossier/analytics-events.md. Rule: only what's in the trace — never guess an
  event name; an untriggered action fires no beacon, so mark it "not observed."
-->

# Analytics & events: <Product>

- **Captured:** <YYYY-MM-DD> · Source: network beacons (`.recon/screens.json` → `analytics`) + HARs.
- **Note:** event payloads can carry user identifiers — treat HARs as sensitive; quote event
  *names/properties*, mask any PII/token values.

## Instrumentation stack (observed)

| Provider | Evidence (host) | Role |
|---|---|---|
| <Segment / Amplitude / PostHog / GA / …> | `<host>` | product analytics / error / session replay |

## Events observed

| Event name | Fired when (action → screen) | Key properties | Provider | Evidence |
|---|---|---|---|---|
| `<event>` | <click X on /route> | `{ prop: … }` (values masked) | <provider> | HAR `.recon/traces/<slug>/network.har` |

## What their instrumentation implies

<The PM read: heavy tracking on <flow> suggests that's their activation metric; a `purchase`
/ `credits_spent` event reveals the monetization moment; a lack of events on <area> suggests
it's not a focus. Keep observed-vs-inferred honest.>

## Unknown / not observed

- <events that only fire on actions you didn't (won't) trigger — e.g. purchase, delete>
- <first-party telemetry sent to their own API and not a named provider — note the endpoint>
