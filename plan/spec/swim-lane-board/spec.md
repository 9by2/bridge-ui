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

When `onItemMove` is a function, sortable pointer and keyboard drag/drop emits `onItemMove({ itemId, source, destination, sourceEvent })` after drop. Omitting the callback disables drag/drop. The package has no persistence, optimistic mutation, or domain validation.

Item `id` values must be unique within one board. Empty expanded cells remain valid drop targets.

`SwimLaneBoardItem` must be a direct `SwimLaneBoardCell` child so the compound parser can derive its coordinate and sortable index. Presentation components may be nested inside the item.

During pointer drag, the matrix and cell track sizes remain fixed. The source item stays as a non-scaling placeholder while a drag overlay follows the pointer.

While an item is actively dragged, every entire expanded cell displays a dotted primary outline and acts as the coordinate drop target. The active cell retains its stronger target treatment, and the outline does not participate in layout or collision geometry.

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
  sourceEvent: "pointer" | "keyboard"
}
```

## Non-Goals

- Product data, copy, authorization, and business transitions.
- Built-in drag engine or persistence.
