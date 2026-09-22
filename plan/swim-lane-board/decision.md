# Decisions: Swim Lane Board

| ID      | Title                              | Status   |
| ------- | ---------------------------------- | -------- |
| DEC-001 | Empty columns collapse by default  | accepted |
| DEC-002 | Move is an emitted UI intent       | accepted |
| DEC-003 | Theme semantic tokens are required | accepted |
| DEC-004 | Lane overflow remains row-local    | accepted |
| DEC-005 | Move callback enables drag/drop    | accepted |

---

### DEC-001: Empty columns collapse by default

**GIVEN** a column receives `count={0}`
**WHEN** the caller does not opt out with `autoCollapse="never"`
**THEN** the column starts collapsed while allowing a user expansion; lanes never collapse.

---

### DEC-002: Move is an emitted UI intent

**GIVEN** a caller drags an item to another coordinate
**WHEN** the item is dropped
**THEN** the board reports source/destination coordinates and does not mutate caller data.

---

### DEC-003: Theme semantic tokens are required

**GIVEN** the component appears inside a Bridge `Theme`
**WHEN** light or dark mode is selected
**THEN** board surfaces, text, borders, and focus ring use the theme semantic token values.

---

### DEC-004: Lane overflow remains row-local

**GIVEN** a lane coordinate contains more items than its configured `rowMaxHeight`
**WHEN** the user scrolls that content
**THEN** the coordinate scrolls independently while the board shell does not gain a vertical scrollbar and the column/lane headers remain sticky on their axes.

---

### DEC-005: Move callback enables drag/drop

**GIVEN** a board may be read-only or interactive
**WHEN** `onItemMove` is omitted
**THEN** items expose no sortable drag capability; providing the function enables dnd-kit pointer and keyboard sorting and reports intent only after drop.
