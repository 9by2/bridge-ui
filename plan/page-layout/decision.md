# Decision

### DEC-001: Presentation Boundary

**GIVEN** application route and translated copy belong to consumers
**WHEN** Page is composed
**THEN** accept all breadcrumb, title, description, action, and content through children.

### DEC-002: Responsive Action

**GIVEN** narrow page header cannot preserve side-by-side alignment
**WHEN** the viewport is below the package mobile breakpoint
**THEN** stack heading and action, with action width available to its child.

### DEC-003: Public Contract

**GIVEN** consumers use stable package paths
**WHEN** Page is released
**THEN** export it from root and generated-compatible deep component paths.
