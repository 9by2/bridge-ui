# Decisions: Color picker

| ID      | Title                    | Status   |
| ------- | ------------------------ | -------- |
| DEC-001 | Preset with injection    | accepted |
| DEC-002 | Fill and gradient option | accepted |
| DEC-003 | Custom color popover     | accepted |
| DEC-004 | Size and layout variants | accepted |
| DEC-005 | Radio semantics          | accepted |

---

### DEC-001: Preset with injection

**GIVEN** every application would otherwise redefine the same palette
**WHEN** `option` is omitted
**THEN** `colorPickerPreset.gradient` renders; consumers may pass `colorPickerPreset.fill` or any own option list. Preset labels are English fallbacks; consumers override via their own list for i18n.

### DEC-002: Fill and gradient option

**GIVEN** the user requires both solid and gradient swatches
**WHEN** an option is declared
**THEN** it is `{ type: "fill", color }` or `{ type: "gradient", stop, shape?, angle? }`; gradient defaults to `linear` at 135deg (system default), `radial` optional. Both types may be mixed in one list.

### DEC-003: Custom color popover

**GIVEN** the reference trailing "•••" control
**WHEN** the user activates it
**THEN** a Popover with native color input and hex field opens; a valid `#rrggbb` commits a `fill` option through `onValueChange`, and the trailing slot renders that color as selected. `custom={false}` removes the control.

### DEC-004: Size and layout variants

**GIVEN** usage in settings panels, toolbars and popovers
**WHEN** composing the picker
**THEN** `size` is `sm | md | lg` (default `md`), `layout` is `grid | row` (default `grid`), and `column` (default 6) sets grid columns.

### DEC-005: Radio semantics

**GIVEN** exactly one swatch is selected at a time
**WHEN** rendering swatches
**THEN** use Base UI RadioGroup for arrow-key navigation and `aria-checked`; each swatch requires an accessible `label`.
