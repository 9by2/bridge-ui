# Spec: Color picker

**Spec ID:** `color-picker`
**Proposal:** `color-picker`
**Status:** accepted

## API

```ts
type ColorPickerOption =
  | { type: "fill"; value: string; label: string; color: string }
  | {
      type: "gradient"
      value: string
      label: string
      stop: readonly string[]
      shape?: "linear" | "radial"
      angle?: number
    }

type ColorPickerProps = {
  option?: readonly ColorPickerOption[] // default colorPickerPreset.gradient
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, option: ColorPickerOption) => void
  size?: "sm" | "md" | "lg" // default "md"
  layout?: "grid" | "row" // default "grid"
  column?: number // grid only, default 6
  custom?: boolean // default true
  customLabel?: string // default "Custom color"
  colorLabel?: string // default "Color"
  hexLabel?: string // default "Hex"
  disabled?: boolean
  name?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  className?: string
}
```

## Acceptance

- Root is a `radiogroup`; each option is a `radio` named by its `label` and `aria-checked` when selected.
- Selecting a swatch calls `onValueChange(option.value, option)`; uncontrolled mode updates selection itself.
- Gradient option defaults to `linear-gradient(135deg, ...stop)`; `radial` yields `radial-gradient(circle, ...stop)`; `angle` overrides the linear angle.
- Custom trigger (when `custom`) opens a dialog-like popover; a valid `#rrggbb` hex or color input change emits `onValueChange(hex, { type: "fill", value: hex, label: hex, color: hex })`. Invalid hex never emits and marks the field `aria-invalid`.
- A value not present in `option` renders as an extra fill `radio` (named by the value) just before the custom trigger, selected.
- `disabled` disables every swatch and the custom trigger.
- Copy is caller-supplied; English defaults exist only as fallback.
