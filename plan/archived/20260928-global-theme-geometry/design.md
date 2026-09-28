# Design: Global Theme Geometry

## Overview

Keep existing Theme context and public CSS variables. Derive detail radius and spacing values from semantic overrides at the Theme root, then replace fixed geometry in owned recipes with shared scale references without altering zero or circular geometry.

## Data Flow

1. Theme writes inherited radius and space scale variables.
2. Owned StyleX recipes consume scale variables in published CSS.
3. Portals use the nearest resolved Theme context.

## Example Code

```tsx
<Theme theme={{ radius: { control: "4px" }, space: { 2: "12px" } }}>
  <Button>Save</Button>
</Theme>
```

## Risks & Mitigations

| Risk                                      | Mitigation                                     |
| ----------------------------------------- | ---------------------------------------------- |
| Circular shapes become rounded rectangles | Preserve pill, circle, and zero values         |
| Default geometry shifts                   | Use original literal as each variable fallback |
