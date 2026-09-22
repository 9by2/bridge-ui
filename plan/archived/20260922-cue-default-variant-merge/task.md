# Tasks: Cue Default Variant Merge

## Setup

- [x] Record approved default-first, additive-variant direction.

## Core

- [x] Review affected public behavior seams; existing control and tab contracts cover interaction and extension availability.
- [x] Merge Cue Checkbox, Switch, Select, Tabs, and Badge defaults into StyleX; confirm Skeleton already matches Cue's 2-second pulse timing.
- [x] Preserve Bridge `capsule`, `success`, `partial-success`, `sm`, and `unstyled` extensions.

## Verification

- [x] Run focused browser, source, and component tests.
- [x] Run required formatting, lint, typecheck, boundary, build, test, coverage, catalog, package, and tree-shaking gates. Coverage remains blocked by pre-existing 100% branch threshold debt; the full catalog is blocked by an unrelated Card-radius assertion in concurrent `public-stylex.test.ts`.
- [x] Capture Bun.WebView evidence and archive the proposal.
