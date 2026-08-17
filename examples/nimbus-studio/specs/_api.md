<!-- FICTIONAL worked example. See ../README.md. Shared API contract (invented). -->

# API contract (observed) — Nimbus Studio

- **Captured:** 2026-02-01 from an owner-operated authed session (fictional).
- **Base(s):** `https://studio.nimbus.example/api/v1` (app data) · `wss://studio.nimbus.example/realtime` (render progress).
- **Auth:** httpOnly cookie `nimbus_sess` — **referenced by name, never value.** `POST /api/v1/session/refresh` rotates it.

## Endpoints

| Method + path | Status | Request (shape) | Response (shape) | Changes on screen | Used by |
|---|---|---|---|---|---|
| `GET /api/v1/me` | 200 | — | `{id, email, plan, sparks}` | header spark balance | [create](screens/create/screen.md) |
| `GET /create/__data.json` | 200 | — | SvelteKit devalue → `{tools[], tool.modes[]}` | tool-card grid | [create](screens/create/screen.md) |
| `GET /billing/__data.json` | 200 | — | `{plan, sparks, unitCosts}` | paywall-vs-run gate | [create](screens/create/screen.md) |
| `POST /api/v1/render` | 200 | `{tool, mode, reference{...}, params}` | `{jobId}` | starts a render; result grid shows a pending card | [restyle](features/restyle.md) |
| `WS /realtime` | 101 | `{subscribe: jobId}` | `{status, outputs[]}` | streams progress → fills the result card | [restyle](features/restyle.md) |

## Auth & session

Login is OAuth → sets `nimbus_sess`; `POST /api/v1/session/refresh` rotates it (observed on a
401 retry). Session state kept in gitignored `.recon/.auth/` — never a token value here.

## Unknown / not exposed / inferred

- `POST /api/v1/render` request body is **inferred** from the client bundle — a real render
  was not triggered (would spend sparks). Video render endpoint **masked** (obfuscated WS).
