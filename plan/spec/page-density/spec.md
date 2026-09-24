# Spec: Page Density

**Spec ID:** `page-density`
**Proposal:** `consumer-gap-close`
**Status:** accepted
**Amends:** [page-layout](../../../spec/page-layout/spec.md), [page-compact-spacing](../../../spec/page-compact-spacing/spec.md)

## Summary

`Page` gains canonical `density` (replacing deprecated `spacing`), a `width` preset, header slots (`PageEyebrow`, `PageMeta`, `PageFilter`) and a form action row (`PageFormAction`). `DataState` gains a retry convenience. No existing render changes.

## Requirements

### REQ-001: Density (DEC-001)

`PageDensity = { compact, default, comfortable, none }`. Resolution: `density ?? spacing ?? "default"`. `spacing` is `@deprecated`. Padding per value is unchanged from `spacing`. `data-density` and `data-spacing` both carry the resolved value.

**Acceptance:**

- [x] `spacing` alone resolves exactly as before.
- [x] `density` overrides `spacing` when both are passed.
- [x] No prop resolves to `default`.

### REQ-002: Width (DEC-005)

`PageWidth = { full, content, form, editor }`. `full` 100% (default, unchanged); `content` centered max 80rem; `form` centered max 48rem; `editor` full width with zero inline padding. `width` controls max-width only; padding stays with `density`, except `editor`. `data-width` carries the value. `width` wins over `variant="container"` max-width when both are set.

**Acceptance:**

- [x] `data-width` reflects the preset; omitted `width` emits no attribute and renders unchanged.
- [x] Catalog shows each width at desktop and mobile without document overflow.

### REQ-003: Header slot

`PageEyebrow` (`p`), `PageMeta` (`div`), `PageFilter` (`div`, full header row) compose inside `PageHeader` / `PageHeading`. Each forwards native props and ref, and renders nothing extra when absent.

**Acceptance:**

- [x] Slots expose `data-slot` and native props; `PageFilter` spans the full header row.

### REQ-004: Form action

`PageFormAction` renders an action row with `align` (`PageFormActionAlign = { start, end, between }`, default `end`) and optional `sticky` pinning the row to the scroll container bottom.

**Acceptance:**

- [x] `data-align` and `data-sticky` reflect props.

### REQ-005: DataState retry

`DataState` accepts `onRetry?: () => void` and `retryLabel?: ReactNode` (default `"Retry"`). With `onRetry`, a standard `Button` renders inside a `DataStateAction` after the caller's children.

**Acceptance:**

- [x] Clicking the retry button calls `onRetry` once.
- [x] Without `onRetry`, no retry button renders.

## Schema / API

```ts
export const PageDensity = { compact: "compact", default: "default", comfortable: "comfortable", none: "none" } as const
export const PageWidth = { full: "full", content: "content", form: "form", editor: "editor" } as const
export const PageFormActionAlign = { start: "start", end: "end", between: "between" } as const
export type PageProps = ComponentProps<"div"> & {
  variant?: PageVariant
  density?: PageDensity
  /** @deprecated use `density` */
  spacing?: PageDensity
  width?: PageWidth
  isDynamicPadding?: boolean
}
```

## Non-Goals

- Removing `spacing` (future major).
- Responsive padding bound to `width`.
