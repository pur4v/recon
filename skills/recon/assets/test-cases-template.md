<!--
  recon TEST CASES (human-readable). One per screen: .recon/specs/screens/<slug>/test-cases.md
  The plain-language companion to <slug>.spec.ts — every case a builder/QA should cover.
  Mark each as automated (in the .spec.ts) or manual, and READ-ONLY vs. requires-a-mutation
  (which recon does NOT run without per-run sign-off).
-->

# Test cases: <Screen name> — `<slug>`

Derived from `screen.md` (states, transitions, data contract). Read-only unless flagged.

| # | Case | Precondition | Steps | Expected | Auto? | Safe? |
|---|---|---|---|---|---|---|
| 1 | Loads + renders shell | authed session | goto route | documented regions/components visible | yes | read-only |
| 2 | Data-contract XHR fires | authed session | goto route | `GET /api/...` fires, 200 | yes | read-only |
| 3 | Empty state | account with no data | goto route | empty prompt shown | manual | read-only |
| 4 | Auth gate | logged out | goto route | redirect to login | yes | read-only |
| 5 | Paywall / quota | at quota | attempt <action> | upgrade modal | manual | **needs mutation — sign-off** |

## Not covered (and why)

- <states that need a destructive action / real quota spend — excluded by discipline.>
