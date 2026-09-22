# Spec: Swim Lane Board

**Spec ID:** `swim-lane-board`
**Proposal:** `swim-lane-board`
**Status:** accepted

## Summary

Defines a reusable, theme-aware Kanban/Scrum presentation board with optional swim lanes.

## Requirements

### REQ-001: Collapse

Columns are collapsible. `autoCollapse` defaults to `"empty"`; an empty column begins collapsed and users can expand it. Lanes are static and never collapse.

### REQ-002: No-lane mode

When direct `Cell` children are used, the board renders workflow header plus one item row. A collapsed column header spans the item row and retains its rotated label and count.

### REQ-003: Move intent

Drop emits `onItemMove({ itemId, source, destination, sourceEvent: "pointer" })`. The package has no persistence or domain validation.

### REQ-004: Theme

Visual values derive from Bridge semantic tokens and work under `Theme mode="light"` and `Theme mode="dark"`.

### REQ-005: Row scrolling

Each lane item viewport and the no-lane item row has an explicit maximum height. `rowMaxHeight` defaults to `"66vh"`; overflowing item content scrolls inside its coordinate while column headers remain sticky at the top and lane headers remain sticky at the left.

## Schema / API

```ts
type SwimLaneBoardItemMoveIntent = {
  itemId: string
  source: { laneId?: string; columnId: string; index: number }
  destination: { laneId?: string; columnId: string; index: number }
  sourceEvent: "pointer"
}
```

## Non-Goals

- Product data, copy, authorization, and business transitions.
- Built-in drag engine or persistence.
