# Decisions: DEV-596 Component Centralization

| ID      | Title                                | Status   |
| ------- | ------------------------------------ | -------- |
| DEC-001 | Centralize only generic presentation | accepted |
| DEC-002 | Use singular timeline package API    | accepted |
| DEC-003 | Keep data-state action controlled    | accepted |
| DEC-004 | Keep table frame engine-neutral      | accepted |

---

### DEC-001: Centralize only generic presentation

**GIVEN** Bridge Web Studio Page combines reusable geometry with application density, copy, icon, and retry policy
**WHEN** the reusable contract moves to `@bridge/ui`
**THEN** only the generic presentation slot moves and application policy remains in Bridge Web.

---

### DEC-002: Use singular timeline package API

**GIVEN** repository naming requires singular production names and Bridge Web has a legacy `TimelineSteps` API
**WHEN** the package defines the canonical component
**THEN** it exports a singular `TimelineStep` family and DEV-597 may adapt the legacy facade.

---

### DEC-003: Keep data-state action controlled

**GIVEN** retry callback, label, icon, and translated copy belong to the application
**WHEN** DataState renders an action
**THEN** the consumer supplies complete action content and the package performs no workflow side effect.

---

### DEC-004: Keep table frame engine-neutral

**GIVEN** consumers may render package Table or another semantic table
**WHEN** TableFrame contains tabular content
**THEN** the frame owns border, hint, and horizontal viewport but not column model, row state, or data behavior.
