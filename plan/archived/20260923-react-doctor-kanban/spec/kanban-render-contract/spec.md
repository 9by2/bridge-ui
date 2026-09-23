# Spec: Kanban Render Contract

**Spec ID:** `kanban-render-contract`
**Proposal:** `react-doctor-kanban`
**Status:** accepted

## Requirements

### REQ-001

Column and item overlay rendering must use the same Hook order as sortable rendering.

### REQ-002

Drag handlers must read the latest committed value, item identifier function, and move callback without writing refs during render.

## Non-Goals

- Changing generated Shadcn source or vendored catalog examples.
