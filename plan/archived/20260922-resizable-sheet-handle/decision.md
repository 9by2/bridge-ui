# Decisions: Resizable Sheet Handle

| ID      | Title                            | Status   |
| ------- | -------------------------------- | -------- |
| DEC-001 | Use a centered inner-edge handle | accepted |

---

### DEC-001: Use a centered inner-edge handle

**GIVEN** an anchored sheet's native CSS resize corner is at a viewport edge.
**WHEN** `resizable` is enabled.
**THEN** render an explicit, pointer-draggable handle at the center of the sheet's inner edge.

---

### DEC-002: Provide side-aware default resize bounds

**GIVEN** a resizable sheet can otherwise consume the entire viewport.
**WHEN** no matching maximum dimension is supplied.
**THEN** left/right sheets use `80vw` as their maximum width and top/bottom sheets use `70vh` as their maximum height.

---

### DEC-003: Keep resize dimension controlled

**GIVEN** persistence and layout composition belong to the consuming application.
**WHEN** a sheet resize handle moves.
**THEN** `SheetContent` reports the next dimension through `onSizeChange` and renders only the `size` supplied by its caller; it does not retain or persist a dimension.
