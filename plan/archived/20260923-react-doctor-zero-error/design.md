# Design: React Doctor Zero Error

## Overview

Move vendor example ref synchronization into layout effects and stabilize input objects with primitive dependencies. Keep event-driven ref writes intact. Shadcn CLI output is managed by its registry and cannot be manually changed.

## Components

| Component        | Responsibility               | Location                                  |
| ---------------- | ---------------------------- | ----------------------------------------- |
| Catalog examples | Interactive chart previews   | `internal/catalog/vendor/tanstack/cases/` |
| Shadcn carousel  | Generated carousel primitive | `app/component/shadcn/carousel.tsx`       |

## Example Code

```tsx
const input = useMemo(() => ({ width, height, revision, preview: false, interactive: true }), [width, height, revision])
useLayoutEffect(() => {
  stateRef.current = state
}, [state])
```

## Risks & Mitigations

| Risk                      | Mitigation                                   |
| ------------------------- | -------------------------------------------- |
| Focus restoration changes | Check chart browser interactions in catalog. |
