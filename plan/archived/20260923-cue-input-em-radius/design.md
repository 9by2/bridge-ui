# Design: Cue Input Relative Radius

## Overview

Use `0.5em` as Cue's default `--bridge-control-radius`. The Input resolves this value against its font size (8px at 16px and 7px at 14px). Keep the existing Theme override and Input icon behavior. Input's standalone fallback becomes `0.625em` rather than an absolute length.

## Components

| Component | Responsibility        | Location                               |
| --------- | --------------------- | -------------------------------------- |
| Theme     | Cue radius default    | `app/component/brand/stylex/theme.tsx` |
| Input     | CSS variable fallback | `app/component/brand/stylex/input.tsx` |

## Data Flow

1. Theme sets the Cue default on its root.
2. Input consumes the CSS variable or its fallback against its font size.
3. A caller-provided radius remains the highest-priority Theme value.

## Example Code

```tsx
<Theme mode="cue">
  <Input aria-label="Search" />
</Theme>
```

## Risks & Mitigations

| Risk                                           | Mitigation                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Shared control-radius affects other components | Browser-test Input at mobile and desktop; keep existing override precedence. |
