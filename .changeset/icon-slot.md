---
"@bridge/ui": patch
---

Size consumer icons without intrinsic dimensions in every icon slot.

An inline SVG with only a `viewBox` (e.g. a consumer brand mark) no longer fills its host box in `MetricTile` `icon` (now 18px), `DataStateMedia` (24px), `EmptyMedia variant="icon"` (16px) or `SettingsNavItem` (16px + 8px gap). Icons with an explicit size (lucide `size`, `size-*` class) are unchanged.
