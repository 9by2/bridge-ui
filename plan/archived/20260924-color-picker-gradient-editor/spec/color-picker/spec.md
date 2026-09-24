# Spec: Color picker

**Spec ID:** `color-picker`
**Proposal:** `color-picker-gradient-editor` (amends `color-picker`)
**Status:** accepted

## API

```ts
type ColorPickerStop = string | { color: string; position?: number } // position in %

type ColorPickerFillOption = { type: "fill"; value: string; label: string; color: string }
type ColorPickerGradientOption = {
  type: "gradient"
  value: string
  label: string
  stop: readonly ColorPickerStop[] // >= 2
  kind?: "linear" | "radial" | "conic" // default linear
  angle?: number // linear direction (default 135) or conic from-angle (default 0)
  shape?: "circle" | "ellipse" // radial, default circle
  repeating?: boolean
}

type ColorPickerProps<Mode extends "fill" | "gradient"> = {
  mode: Mode // required, declared by the composing layer
  option?: readonly (Mode extends "fill" ? ColorPickerFillOption : ColorPickerGradientOption)[] // default colorPickerPreset[mode]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, option: /* option of Mode */) => void
  size?: "sm" | "md" | "lg" // default md
  layout?: "grid" | "row" // default grid
  column?: number // default 6
  custom?: boolean // default true
  label?: Partial<ColorPickerLabel> // default colorPickerDefaultLabel
  disabled?: boolean
  name?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

colorPickerBackground(option): string
colorPickerParse(css: string): ColorPickerOption | null
```

## Acceptance

- Root is a `radiogroup`; each option is a `radio` named by `label`, `aria-checked` when selected; arrow keys move selection.
- `mode` is required; the component never infers it. The mode picks the option type, default preset and editor.
- Selecting a swatch calls `onValueChange(option.value, option)`; uncontrolled mode updates itself; `name` submits the value.
- Serialization: `linear-gradient(<angle>deg, …)`, `radial-gradient(<shape>, …)`, `conic-gradient(from <angle>deg, …)`, `repeating-` prefix when `repeating`; stop `position` renders as `<color> <n>%`.
- `colorPickerParse` restores anything `colorPickerBackground` emits, plus hex fills; other CSS returns `null`.
- A `value` not in `option` that parses into the current mode renders as a selected extra radio named by the CSS string; a value from the other mode or unparsable CSS renders no extra swatch.
- Fill editor: native color input and hex field; only `#rrggbb` (the `#` is optional) commits; invalid hex sets `aria-invalid`.
- Gradient editor: preview, type select, angle input (linear / conic) or shape select (radial), repeating switch, and a stop list with color, position, remove (disabled at 2 stops) and add stop. Every edit commits `onValueChange(css, gradientOption)`. The editor starts from the selected option, or from `linear 135deg #000000 → #ffffff` when nothing is selected. Empty number input does not commit.
- `disabled` disables swatches and the custom trigger.
- Copy is caller-supplied through `label`; English defaults are fallback only.
