<!-- FICTIONAL worked example. See ../../../README.md. -->

# Test cases: Create — `create`

Derived from `screen.md` (states, transitions, data contract). Read-only unless flagged.

| # | Case | Precondition | Steps | Expected | Auto? | Safe? |
|---|---|---|---|---|---|---|
| 1 | Loads + tool grid | authed session | goto `/create` | 8 tool cards + spark balance visible | yes | read-only |
| 2 | Load requests fire | authed session | goto `/create` | `GET /create/__data.json` 200 | yes | read-only |
| 3 | Auth gate | logged out | goto `/create` | redirect to OAuth | yes | read-only |
| 4 | Empty history | fresh account | goto `/create` | "Run your first render" prompt | manual | read-only |
| 5 | Paywall at 0 sparks | account at 0 sparks | click a tool → Run | upgrade modal | manual | **needs a render — sign-off** |

## Not covered (and why)

- Server-error banner — can't force a backend error safely (excluded).
- Actual render output — would spend sparks; excluded without per-run sign-off.
