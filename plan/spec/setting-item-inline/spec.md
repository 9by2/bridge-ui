# Spec: Setting Item Inline Variant

**Spec ID:** `setting-item-inline`
**Proposal:** `setting-item-inline`
**Status:** accepted

## Summary

Defines a compact `SettingItem` presentation for account-style label-and-value rows while retaining caller ownership of values and controls.

## Requirements

### REQ-001: Inline layout

`SettingItem` SHALL accept `variant="inline"` and place its title and action in a compact, full-width two-column row. The action SHALL align to the row end and permit long content to wrap rather than overflow.

**Acceptance:**

- [ ] The public variant is available from the root and direct component entry.
- [ ] A long action value is contained at narrow widths.

### REQ-002: Optional supporting copy

An inline item with `SettingItemDescription` SHALL retain the action in its first row and place the description below the title.

**Acceptance:**

- [ ] The inline catalog demonstrates rows with and without supporting copy.

## Schema / API

```tsx
type SettingItemVariant = "default" | "inline"

export function SettingItem(
  props: ComponentProps<"section"> & { variant?: SettingItemVariant | null }
): React.JSX.Element
```

## Non-Goals

- Editing state, save behavior, iconography, routing, or translated account copy.
