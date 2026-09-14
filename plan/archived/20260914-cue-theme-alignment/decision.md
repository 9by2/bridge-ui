# Decisions: Cue Theme Alignment

| ID      | Title                                | Status   |
| ------- | ------------------------------------ | -------- |
| DEC-001 | Add explicit Cue mode                | accepted |
| DEC-002 | Separate destructive action and copy | accepted |
| DEC-003 | Keep status vocabulary reusable      | accepted |

---

### DEC-001: Add explicit Cue mode

**GIVEN** Bridge UI serves more than Cue and existing light/dark behavior is public
**WHEN** exact Cue theme is selected
**THEN** consumer uses `mode="cue"` and generic light/dark behavior remains available.

---

### DEC-002: Separate destructive action and copy

**GIVEN** Cue uses solid destructive fill for action and lighter red for error copy
**WHEN** Button and Badge render destructive semantic
**THEN** Button uses fill plus destructive foreground while Badge keeps tint plus destructive text.

---

### DEC-003: Keep status vocabulary reusable

**GIVEN** pending is product vocabulary while warning is reusable presentation semantic
**WHEN** package exposes Badge state
**THEN** package exposes `success`, `partial-success`, and `warning`; Cue may map pending to warning.
