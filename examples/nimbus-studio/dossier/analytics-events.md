<!-- FICTIONAL worked example. See ../../README.md. Analytics & events (invented). -->

# Analytics & events: Nimbus Studio

- **Captured:** 2026-02-01 · Source: network beacons (`screens.json` → `analytics`) + HARs.
- **Note:** payloads can carry user ids — HARs are sensitive; values masked below.

## Instrumentation stack (observed)

| Provider | Evidence (host) | Role |
|---|---|---|
| Segment | `api.segment.io` | product analytics |
| Sentry | `o123.ingest.sentry.io` | error tracking |

## Events observed

| Event name | Fired when | Key properties | Provider | Evidence |
|---|---|---|---|---|
| `screen_viewed` | on `/create` load | `{screen:"create"}` | Segment | HAR `create/network.har` |
| `render_started` | click **New render** | `{tool, mode}` | Segment | HAR (inferred — not triggered) |
| `sparks_low` | balance banner shown | `{remaining}` | Segment | HAR |

## What their instrumentation implies

`render_started` is almost certainly their activation metric — everything funnels toward the
first render. A `sparks_low` event shows they instrument the monetization nudge.

## Unknown / not observed

- `render_completed` / `purchase` fire only on actions not triggered in a read-only session.
