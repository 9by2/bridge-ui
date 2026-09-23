# Design: Cue Input Radius

## Overview

Cue's `rounded-lg` resolves to 8px. Set the control-radius variable's Cue default in Theme instead of adding a component-only mode selector. Input's prior StyleX fallback compiled to an undefined variable, so its recipe must reference the public CSS variable literally. Explicit theme overrides retain precedence.

## Components

| Component | Responsibility                          | Location                               |
| --------- | --------------------------------------- | -------------------------------------- |
| Theme     | Mode default and override precedence    | `app/component/brand/stylex/theme.tsx` |
| Input     | Consume public control radius literally | `app/component/brand/stylex/input.tsx` |

## Data Flow

1. Theme chooses the Cue radius unless a caller supplies `theme.radius.control`.
2. Input consumes `--bridge-control-radius` literally through its StyleX recipe.

## Example Code

```tsx
<Theme mode="cue"><Input aria-label="Search" /></Theme>
<Theme mode="cue" theme={{ radius: { control: "3px" } }}><Input aria-label="Search" /></Theme>
```

## Risks & Mitigations

| Risk                                     | Mitigation                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| Other shared controls inherit Cue radius | Cue Textarea also specifies rounded-lg; verify other theme defaults unchanged. |
