# Decisions: Tabs Line Cleanup

### DEC-001: Keep two variants

**GIVEN** the public option needs only filled-default and navigation-line presentation
**WHEN** the Tabs variant contract is amended
**THEN** `border-bottom` is removed and `line` owns the full-width baseline treatment

### DEC-002: Remove trigger frame

**GIVEN** active triggers must not appear boxed
**WHEN** either variant renders
**THEN** default has no border and line adds only bottom-border width
