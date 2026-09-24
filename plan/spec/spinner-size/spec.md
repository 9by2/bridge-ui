# Spec: Spinner Size

**Spec ID:** `spinner-size`
**Proposal:** `consumer-gap-close`
**Status:** accepted

## Summary

`Spinner` accepts a declarative `size` so consumers drop their wrapper.

## Requirements

### REQ-001: Size scale

`SpinnerSize = { sm, default, lg } as const`; `size?: SpinnerSize` defaults to `default` (16px, unchanged). `sm` = 12px, `lg` = 24px. `data-size` reflects the resolved size.

**Acceptance:**

- [x] Every size keeps `role="status"` and an accessible label; caller `aria-label` overrides.
- [x] Default render is unchanged.
- [x] Explicit `size` wins inside a container that sizes descendant icons (Button); implicit size keeps container sizing.

## Schema / API

```ts
export const SpinnerSize = { sm: "sm", default: "default", lg: "lg" } as const
export type SpinnerSize = ValueOf<typeof SpinnerSize>
export type SpinnerProps = ComponentProps<"svg"> & { size?: SpinnerSize }
```

## Non-Goals

- Custom icon glyph.
