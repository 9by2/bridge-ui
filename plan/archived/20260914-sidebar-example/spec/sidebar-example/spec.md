# Sidebar Example Spec

**Status:** accepted

## Requirement

The Sidebar catalog documents every public collapsible mode and every side/variant combination with a dedicated full application shell.

## Acceptance

- Each example renders `SidebarProvider`, `Sidebar`, and `SidebarInset`.
- Collapse examples render `offcanvas`, `icon`, and `none` separately.
- Side/variant examples render left/right with sidebar/floating/inset separately.
- Configured data attributes match the documented example.
- Sidebar and SidebarInset bounding boxes do not overlap on either side.
- Sidebar is flush, floating has sidebar padding and visible elevation, and inset adds a 12px content gutter, outline, and visible elevation.
- No example introduces horizontal document overflow.
