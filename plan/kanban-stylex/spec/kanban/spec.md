# Spec: Kanban

**Spec ID:** `kanban`
**Proposal:** `kanban-stylex`
**Status:** accepted

## Summary

Defines a token-styled generic controlled Kanban compound component for column and item reordering.

## Requirements

### REQ-001: Controlled value

`Kanban` accepts a record of column items, a value-change callback, and an item identifier callback. A completed drag updates the supplied value unless `onMove` is provided.

**Acceptance:**

- [ ] Same-column and cross-column moves preserve item order in emitted controlled values.

### REQ-002: Move intent

When `onMove` is provided, an item drag emits source and destination container indexes without mutating the controlled value.

**Acceptance:**

- [ ] Consumers receive the active and target coordinates through `KanbanMoveEvent`.

### REQ-003: Presentation

Default board, column, content, item, and handle styles use Bridge semantic tokens and remain overrideable by `className`.

**Acceptance:**

- [ ] The public catalog renders a usable multi-column board.

### REQ-004: Drag feedback

Item handles prevent text selection during pointer gestures. An active item has a raised backdrop, every valid item column becomes an explicit drop zone when dragging starts, and the hovered column receives a stronger target state.

**Acceptance:**

- [ ] Item content exposes `data-drop-zone` during item drag and `data-drop-target` for the hovered destination.
- [ ] Overlay items reuse the same `KanbanItem` composition and visual recipe as their dropped render.

## Schema / API

```ts
type KanbanMoveEvent = {
  activeContainer: string
  activeIndex: number
  overContainer: string
  overIndex: number
}
```

## Non-Goals

- Persistence, business transition policy, filters, or swim lanes.
