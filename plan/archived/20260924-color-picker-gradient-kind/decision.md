# Decisions: Color picker gradient kind from composition

| ID      | Title                              | Status   |
| ------- | ---------------------------------- | -------- |
| DEC-001 | Composition-declared gradient kind | accepted |

---

### DEC-001: Composition-declared gradient kind

**GIVEN** the gradient function is a product decision of the composing surface
**WHEN** rendering `ColorPicker` with `mode="gradient"`
**THEN** `kind` (`linear` | `radial` | `conic`) is required, the editor exposes no kind control, only swatches and values of that kind render, and every commit emits that kind. Supersedes `color-picker-gradient-editor` DEC-002's editable type select.
