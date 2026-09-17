# Tasks: DEV-596 Component Centralization

Implementation order matters - complete top to bottom.

## Setup

- [x] Reconcile DEV-596 against current StyleX, package, and active plan state.
- [x] Define extraction boundary and accepted spec.

## Test

- [x] Add failing component contract test for timeline, toolbar, data state, and table frame.
- [x] Add failing public export and package subpath assertions.

## Core

- [x] Implement package-owned StyleX timeline component.
- [x] Implement Page toolbar, controlled data state, and engine-neutral table frame.
- [x] Register root and stable package export.

## Catalog

- [x] Add default and state catalog example with long/Thai/mobile/reduced-motion coverage.
- [x] Add focused browser verification and Bun.WebView evidence.

## Integration

- [x] Update component inventory and package documentation.
- [x] Add package Changeset.

## Verification

- [x] Run formatter, lint, typecheck, boundary, test, runtime coverage, brand coverage, catalog build/check, package build/check, and tree-shaking check.
- [x] Review every spec acceptance against implementation.
- [x] Archive proposal and sync accepted spec.
- [x] Commit directly on `main` with repository title format.

Verification: formatter, lint (10 existing generated-source warnings, no error), typecheck, boundary, 340 Bun test, 100% brand/runtime coverage, package build and packed client/SSR verification, tree-shaking, 473 Playwright catalog test, focused Axe, and Bun.WebView evidence pass. Evidence is stored in `.eval/0917-dev-596/`.
