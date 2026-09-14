# Decisions: Shell Header

| ID      | Title                                | Status   |
| ------- | ------------------------------------ | -------- |
| DEC-001 | Keep shell and page heading separate | accepted |
| DEC-002 | Use an h1 with ellipsis              | accepted |
| DEC-003 | Let flex layout own sidebar width    | accepted |
| DEC-004 | Avatar overrides square-corner reset | accepted |

---

### DEC-001: Keep shell and page heading separate

**GIVEN** `PageHeader` is a large in-page heading composition
**WHEN** an application needs a compact shell top bar
**THEN** it uses a separate `ShellHeader` primitive and `PageHeader` remains unchanged.

---

### DEC-002: Use an h1 with ellipsis

**GIVEN** a route title may be long and the action may need space
**WHEN** title width exceeds available header width
**THEN** `ShellHeaderTitle` remains one line and truncates with an ellipsis.

---

### DEC-003: Let flex layout own sidebar width

**GIVEN** the desktop sidebar gap changes width when collapsed
**WHEN** Sidebar state changes
**THEN** `SidebarInset` shrinks or expands through `flex: 1`, `width: 100%`, and `minWidth: 0` without calculated application width.

---

### DEC-004: Avatar overrides square-corner reset

**GIVEN** the package compatibility adapter resets component slot radius to square corners
**WHEN** an Avatar root, image, or fallback renders inside a package theme
**THEN** the Avatar-specific adapter rule restores a full circular radius on its surface and `::after` border with equal priority.
