# Design: Setting Item Icon Actions

## Overview

Catalog examples will use the existing ghost, small icon `Button` and `PencilIcon`. The accessible action name remains on the button through `aria-label`.

## Components

| Component            | Responsibility                                        | Location                                           |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| Setting item catalog | Demonstrate compact edit affordances                  | `internal/catalog/example/setting-item/states.tsx` |
| Settings catalog     | Demonstrate icon actions in composed settings content | `internal/catalog/example/settings/default.tsx`    |

## Example Code

```tsx
<UI.Button aria-label="Edit email" size="icon-sm" variant="ghost">
  <PencilIcon aria-hidden="true" />
</UI.Button>
```
