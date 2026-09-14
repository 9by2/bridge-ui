# Decision: Sidebar Toggle Variant

### DEC-001: Keep the variant surface after toggle

**GIVEN** the catalog compares sidebar surface variant
**WHEN** the user toggles a side/variant example
**THEN** the sidebar collapses to an icon rail instead of leaving the viewport.

### DEC-002: Verify post-transition geometry

**GIVEN** Sidebar width transitions for 200ms
**WHEN** browser coverage verifies the collapsed state
**THEN** it waits for stable geometry and checks rail width, gutter, inset treatment, side placement, non-overlap, and overflow.

### DEC-003: Separate floating and inset ownership

**GIVEN** floating elevates the navigation surface and inset elevates the content surface
**WHEN** either variant collapses
**THEN** only floating keeps the padded 66px rail while inset uses a flush 48px rail beside its inset content panel.
