<!--
  recon SHARED API contract. One per product: .recon/specs/_api.md
  The cross-screen source of truth for endpoints. Per-screen/feature specs link here and keep
  only their own slice. Rules: OBSERVED from the HAR only · reference auth by LOCATION, never
  the token value · mark inferred request/response shapes as inferred · no secrets, ever.
-->

# API contract (observed) — <product>

- **Captured:** <YYYY-MM-DD> from <your own authed session | public traffic>.
- **Base(s):** `https://api.<host>/...` (data) · `https://app.<host>/api/...` (app routes).
- **Auth:** <httpOnly cookies `<name>` / bearer header / none> — **referenced by location, never
  value.** <token rotation / CSRF endpoint if observed.>

## Endpoints

| Method + path | Status | Request (shape) | Response (shape) | Changes on screen | Used by |
|---|---|---|---|---|---|
| `GET /api/v1/...` | 200 | — | `{ ... }` | populates <region> | [screen](screens/<slug>/screen.md) |
| `POST /api/v1/...` | 200 | `{ ... }` | `{ ... }` | renders <result> | [feature](features/<slug>.md) |
| `PUT /api/v1/...` | 200 | `{ ... }` *(inferred — not triggered)* | `{ ... }` | <effect> | <screen/feature> |

## Auth & session

<How auth flows (login, refresh/rotation, CSRF), referenced by endpoint + cookie/header NAME.
Never record a token value. Session state lives in gitignored `.recon/.auth/`.>

## Notes

- <pagination, rate limits, error envelope shape, versioning — observed only.>

## Unknown / not exposed / inferred

- <mutation bodies not triggered in a read-only session; endpoints seen but not exercised.>
