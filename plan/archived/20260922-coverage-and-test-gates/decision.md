# Decisions: Coverage and Test Gates

### DEC-001: Preserve meaningful coverage seams

**GIVEN** owned runtime coverage is mandatory.
**WHEN** a branch is uncovered.
**THEN** cover it through a public behavior or consumer contract, not a presentation-only assertion.

### DEC-002: Do not weaken gate configuration

**GIVEN** the repository requires 90% runtime coverage and 100% owned StyleX coverage.
**WHEN** a gate fails.
**THEN** correct behavior, tests, or configuration defects without lowering thresholds or excluding owned source.
