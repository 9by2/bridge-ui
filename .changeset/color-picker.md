---
"@bridge/ui": minor
---

Add ColorPicker. The composing layer declares a required `mode` (`fill` | `gradient`) and, for gradients, a required `kind` (`linear` | `radial` | `conic`). Includes injectable system presets (`colorPickerPreset.fill`, `colorPickerGradientPreset(kind)`), a custom editor (hex for fill; angle or shape, repeating and positioned stops for gradient) that emits the CSS string with a `colorPickerParse` round-trip, and `size` / `layout` variants.
