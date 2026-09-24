# Design: Color picker gradient kind from composition

`ColorPicker` dispatches on `mode`. Gradient mode goes through `GradientPicker`, which filters `option` to the declared `kind`, rejects parsed values of another kind, and binds `kind` into `GradientEditor`. The editor renders angle (linear, conic) or shape (radial), repeating, and stops, and always emits the declared kind.

```tsx
<ColorPicker
  mode="gradient"
  kind="conic"
  aria-label="Badge ring"
  option={toOption("conic")}
  value={value}
  onValueChange={save}
/>
```

| Risk                                                 | Mitigation                                             |
| ---------------------------------------------------- | ------------------------------------------------------ |
| Existing option list mixes kinds                     | Filtered to declared kind; omitted `kind` means linear |
| Composition wants the system palette in another kind | `colorPickerGradientPreset(kind)`                      |
