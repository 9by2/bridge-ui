# Decisions: Kanban StyleX

| ID      | Title                                | Status   |
| ------- | ------------------------------------ | -------- |
| DEC-001 | Preserve generic controlled contract | accepted |
| DEC-002 | Keep SwimLaneBoard separate          | accepted |
| DEC-003 | Make pointer drag state visible      | accepted |
| DEC-004 | Highlight only hovered destination   | accepted |
| DEC-005 | Reveal every valid drop zone         | accepted |

---

### DEC-001: Preserve generic controlled contract

**GIVEN** consumers own Kanban item state and persistence
**WHEN** an item drag completes
**THEN** the component updates `onValueChange` or emits `onMove`, without persistence.

---

### DEC-002: Keep SwimLaneBoard separate

**GIVEN** SwimLaneBoard has lane-specific layout and move-intent semantics
**WHEN** publishing generic Kanban
**THEN** both components remain independently exported.

---

### DEC-003: Make pointer drag state visible

**GIVEN** an item drag starts or moves over a valid column
**WHEN** a pointer is held on a Kanban handle
**THEN** selection is disabled, the source item receives an elevated backdrop, and the target column content exposes an active drop target state.

---

### DEC-004: Highlight only hovered destination

**GIVEN** an item is dragged over a board column
**WHEN** dnd-kit resolves its current `over` target
**THEN** only that target column content receives the drop-target treatment.

---

### DEC-005: Reveal every valid drop zone

**GIVEN** an item drag starts
**WHEN** the pointer has not resolved a destination or moves between destinations
**THEN** every valid item column remains visibly marked as a drop zone, with the hovered destination receiving stronger emphasis.
