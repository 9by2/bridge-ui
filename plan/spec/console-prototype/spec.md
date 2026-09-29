# Spec: Console Prototype

**Spec ID:** `console-prototype`
**Proposal:** `console-prototype`
**Status:** accepted

## Summary

Catalog family `prototype` demonstrates every public component family composed into multi-page consoles with package
defaults.

## Requirements

### REQ-001 Complete coverage

Each prototype (`backstage`, `admin`) plus `shared` uses at least one root export of every catalog family.

**Acceptance:**

- [x] Static guard reports zero missing family per prototype.

### REQ-002 Default setting

Prototype source imports the package only as `import * as UI from "@bridge/ui"` (types via `import type`) and never
passes an appearance utility className to a `UI.*` component.

**Acceptance:**

- [x] Guard and catalog-consumer-parity guard pass over `internal/catalog/prototype/**`.

### REQ-003 Runtime

Every navigation page renders without page error; the default page has no horizontal document overflow at 390px.

**Acceptance:**

- [x] `test/browser/prototype.test.ts` passes.

## Non-Goals

- URL routing, real data, product i18n.
