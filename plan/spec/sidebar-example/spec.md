# Sidebar Example Spec

**Status:** accepted

## Requirement

The Sidebar catalog documents every public collapsible mode and every side/variant combination with a dedicated full application shell. Each side/variant example demonstrates both expanded and icon-collapsed geometry.

## Acceptance

- Each example renders `SidebarProvider`, `Sidebar`, and `SidebarInset`.
- Collapse examples render `offcanvas`, `icon`, and `none` separately.
- Side/variant examples render left/right with sidebar/floating/inset separately.
- Each side/variant example sets `collapsible="icon"`.
- Toggle retains a visible icon rail.
- Collapsed content remains contained within the icon rail.
- Collapsed sidebar uses a 48px flush rail.
- Collapsed floating uses a padded 66px rail.
- Collapsed inset uses a flush 48px rail beside the separate content surface.
- Inset retains its content gutter, outline, and elevation after toggle.
- Configured data attributes match the documented example.
- Left and right layout remain non-overlapping without horizontal overflow.
