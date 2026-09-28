# Spec: Catalog Consumer Parity

**Spec ID:** `catalog-consumer-parity`
**Proposal:** `catalog-consumer-parity`
**Status:** accepted

## Requirements

### REQ-001: Consumer cascade

The catalog declares `@layer theme, base, components, utilities, priority1..9`: Tailwind utilities resolve before package StyleX, as in an application that imports Tailwind before `@bridge/ui/style.css`.

### REQ-002: Example styling boundary

A catalog example never passes spacing, typography, border, radius, color, or shadow utilities to a `UI.*` component (`ResponsiveImage` excepted: it has no package appearance). Example layout lives on plain wrapper elements. Component appearance comes from package defaults, props, or variants.

### REQ-003: Sidebar and menu defaults

SidebarHeader/Footer/Group pad with `--bridge-unit-8` (0.5rem). Sidebar and DropdownMenu text use root-relative `--bridge-text-size-*`. SidebarGroupLabel and menu buttons stay single-line; group label ellipsizes. DropdownMenuContent width fits content within max(anchor, 8rem) and min(20rem, available width); items wrap.

### REQ-004: Parity proof

`sidebar/default` and `dropdown-menu/default` computed padding, gap, font size, line height, weight, width and height equal an independent consumer fixture built from `dist/` at 1440px and 390px with no document overflow. Theme `radius` overrides still reach every sidebar and menu part.

### REQ-005: Variants

`PaginationLink activeVariant` (`PaginationActiveVariant.outline | muted`); `Empty variant` (`EmptyVariant.default | outline | muted`).
