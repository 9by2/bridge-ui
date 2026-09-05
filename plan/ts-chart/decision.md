# TsChart Decision

**GIVEN** standalone charts render but the full catalog leaves blank iframe
**WHEN** mounting chart examples
**THEN** defer offscreen preview loading and test embedded geometry.

**GIVEN** the old react-charts package is unmaintained
**WHEN** adding TanStack
**THEN** use an exact published @tanstack/charts version and a separate TsChart export.
