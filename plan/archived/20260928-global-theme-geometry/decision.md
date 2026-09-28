# Decisions: Global Theme Geometry

### DEC-001: Owned boundary

**GIVEN** Shadcn source is generated and published components use owned wrappers
**WHEN** global geometry is customized
**THEN** owned recipes respond without editing generated source.

### DEC-002: Test seam

**GIVEN** visual values require a browser
**WHEN** verifying theme overrides
**THEN** assert computed styles for representative owned components and portals, and static inventory for recipe coverage.
