<!-- FICTIONAL worked example. See ../README.md. Spec-mode index. -->

# Nimbus Studio — spec index

Build-ready dossiers (Spec mode), grouped by section. One file per feature and one folder per
screen; each is deep enough to rebuild the item from. Shared API contract: [`_api.md`](_api.md).
Abridged for the example — a real run has one entry per item across all sections.

- **Last verified:** 2026-02-01 · **Status:** verified (illustrative)

## Features

| Section | Feature | Purpose | Spec |
|---|---|---|---|
| Create | Restyle | restyle an upload to match a Brand Kit | [features/restyle.md](features/restyle.md) |

## Screens

| Route | Screen | Purpose | Spec (+ tests) |
|---|---|---|---|
| `/create` | Create | workspace hub — pick a tool, run it, see results | [screen.md](screens/create/screen.md) · [spec.ts](screens/create/create.spec.ts) · [cases](screens/create/test-cases.md) |
