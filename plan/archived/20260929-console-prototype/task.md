# Tasks: Console Prototype

## Setup

- [x] Branch `feat/backstage-console` from synced `main`.
- [x] Failing guard `test/internal/catalog-prototype.test.ts`; register `prototype` family; extend parity guard scope.

## Core

- [x] Shared `ConsoleShell`.
- [x] Backstage Console pages covering 97 families.
- [x] Admin Console pages covering 97 families.
- [x] Catalog full-bleed render + description + taller preview for `prototype`.

## Integration

- [x] Browser contract `test/browser/prototype.test.ts` registered in `cmd/run-catalog-test.ts`.
- [x] CUSTOMIZATION.md / README note.

## Verification

- [x] Regression: implicit auto grid track overflow at 390px fixed with `grid-cols-1`; covered by `test/browser/prototype.test.ts`.

- [x] Bun.WebView evidence in `.eval/0929-console-prototype/`.
- [x] fmt, lint, typecheck, test, coverage, catalog:build, catalog:test, react-doctor.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal.
