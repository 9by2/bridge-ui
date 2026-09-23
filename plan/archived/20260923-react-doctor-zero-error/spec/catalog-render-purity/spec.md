# Spec: Catalog Render Purity

**Spec ID:** `catalog-render-purity`
**Proposal:** `react-doctor-zero-error`
**Status:** accepted

## Requirements

### REQ-001

Chart preview ref snapshots must correspond to committed React renders, not discarded render work.

### REQ-002

Chart definitions dependent on dimensions and revision must be stable across unrelated updates.

## Non-Goals

- Changing catalog public APIs or generated Shadcn source manually.
