# Spec: Compact Page Spacing

**Spec ID:** `page-compact-spacing`
**Proposal:** `page-compact-spacing`
**Status:** accepted

## Summary

Defines static named spacing options and opt-in responsive padding for the `Page` layout component.

## Requirements

### REQ-000: Compact title scale

`PageTitle` SHALL use a 32px desktop font size and a 26px font size at viewports up to 640px.

**Acceptance:**

- [x] The Page catalog shows the title at the compact desktop and mobile scales.

### REQ-001: Named spacing

`Page` SHALL use static padding by default. It SHALL accept `spacing="none"` and render zero padding, `spacing="compact"` and render 16px padding, or `spacing="comfortable"` and render 24px padding on all sides. `isDynamicPadding` SHALL explicitly enable responsive gutter overrides.

**Acceptance:**

- [x] Named spacing pages expose their selected `data-spacing` value.
- [x] Static pages do not expose dynamic padding state.
- [x] Dynamic pages expose their opt-in dynamic padding state.
- [x] The catalog renders every Page child in default, none, compact, comfortable, and dynamic-padding configurations.

## Schema / API

```tsx
export function Page(
  props: ComponentProps<"div"> & {
    spacing?: "default" | "none" | "compact" | "comfortable"
    isDynamicPadding?: boolean
  }
): React.JSX.Element
```

## Non-Goals

- Consumer migration or custom arbitrary padding values.
