# Spec: Catalog Bundle Splitting

**Spec ID:** `catalog-bundle-splitting`
**Proposal:** `catalog-bundle-splitting`
**Status:** accepted

## Requirements

### REQ-001: Catalog initial and lazy asset ceiling

The catalog entry chunk SHALL remain below 500 kB after minification. Route-lazy catalog assets SHALL remain below 900 kB.

**Acceptance:**

- [x] Build verification fails for any route-lazy JavaScript asset over 900 kB.
- [x] The catalog build completes without a Vite chunk-size warning.

## Non-Goals

- Changing the published package bundle.
