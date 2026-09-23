# Design: Cue Input CSS Radius

## Overview

Retain the base control radius in the published stylesheet. Add a Cue-mode selector there for `0.5em`. Remove the unconditional inline radius from Theme; emit it only when an explicit `theme.radius.control` exists. Nested Themes inherit explicit overrides via the existing mergeTheme contract.

## Components

| Component       | Responsibility                | Location                               |
| --------------- | ----------------------------- | -------------------------------------- |
| Published style | Base and Cue defaults         | `app/style/component.css`              |
| Theme           | Explicit radius override only | `app/component/brand/stylex/theme.tsx` |
| Catalog preview | Load published style contract | `internal/catalog/preview.css`         |

## Data Flow

1. `@bridge/ui/style.css` defines default and Cue values.
2. Input consumes the public `--bridge-control-radius` variable.
3. Inline Theme override, when provided, wins over stylesheet defaults.

## Example Code

```tsx
<Theme mode="cue"><Input aria-label="Search" /></Theme>
<Theme mode="cue" theme={{ radius: { control: "0.25em" } }}><Input aria-label="Search" /></Theme>
```

## Risks & Mitigations

| Risk                                      | Mitigation                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Theme defaults used without published CSS | Package usage already requires `@bridge/ui/style.css`; catalog preview imports it alongside its private baseline; Input retains a standalone fallback. |
