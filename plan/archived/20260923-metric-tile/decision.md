# Decisions: Metric tile

### DEC-001: Required variants

**GIVEN** the dashboard has different visual emphasis **WHEN** a tile renders **THEN** the consumer explicitly selects `standard`, `featured`, or `compact`; no default variant is assumed.

### DEC-002: Package boundary

**GIVEN** application-specific reporting data **WHEN** composing tiles **THEN** the application owns grid, formatting and data; the package owns only presentation.
