# Decision

### DEC-001: Honest Coverage

**GIVEN** scoped brand coverage does not establish repository coverage
**WHEN** enforcing the foundation
**THEN** add an explicit whole-source gate without excluding generated production code or lowering the 90% floor.

### DEC-002: Static Compilation

**GIVEN** generated component uses Tailwind and cannot be manually rewritten
**WHEN** integrating StyleX
**THEN** migrate owned presentation first, statically extract its CSS, and preserve generated Tailwind styling in the shared stylesheet. Do not describe this as a complete Tailwind migration.
