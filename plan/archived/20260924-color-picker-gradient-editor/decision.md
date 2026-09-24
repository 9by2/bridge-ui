# Decisions: Color picker gradient editor

| ID      | Title                              | Status   |
| ------- | ---------------------------------- | -------- |
| DEC-001 | Required composition-declared mode | accepted |
| DEC-002 | Gradient function coverage         | accepted |
| DEC-003 | CSS string value                   | accepted |
| DEC-004 | Grouped label override             | accepted |

---

### DEC-001: Required composition-declared mode

**GIVEN** the composing layer knows its payload shape
**WHEN** rendering a `ColorPicker`
**THEN** `mode` is required and never inferred; the composing layer transforms its payload into `ColorPickerFillOption[]` or `ColorPickerGradientOption[]` and injects it. Supersedes the mixed-list behavior of `color-picker` DEC-002.

### DEC-002: Gradient function coverage

**GIVEN** the CSS gradient functions
**WHEN** authoring a custom gradient
**THEN** the editor supports `linear` (angle), `radial` (circle / ellipse), `conic` (from angle), a repeating toggle, and stops with optional percentage position. Interpolation space, radial size and position, and color hints are deferred.

### DEC-003: CSS string value

**GIVEN** consumers need a persistable value
**WHEN** a custom color or gradient is committed
**THEN** `value` is the CSS string and `option` is the structured data; `colorPickerParse` restores emitted CSS into the editor.

### DEC-004: Grouped label override

**GIVEN** the editor adds many labelled controls
**WHEN** a consumer localizes copy
**THEN** one `label` partial object overrides `colorPickerDefaultLabel`, replacing `customLabel` / `colorLabel` / `hexLabel`.
