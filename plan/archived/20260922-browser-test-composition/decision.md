# Decisions: Browser Test Composition

### DEC-001: Exhaustive inventory is static

**GIVEN** every catalog example must remain discoverable and compilable
**WHEN** catalog verification runs
**THEN** static inventory and Vite build own all-example coverage rather than a browser test per fixture.

### DEC-002: Browser scope is risk-selected

**GIVEN** browser execution is expensive
**WHEN** selecting browser cases
**THEN** retain only browser-only public contracts, unique semantic compositions, and focused defect regressions.

### DEC-003: Visual and memory are diagnostics

**GIVEN** screenshot and heap probes are specialized and change-sensitive
**WHEN** routine pre-push verification runs
**THEN** exclude them and expose explicit commands for relevant changes and release verification.

### DEC-004: Completed migration proof is removed

**GIVEN** StyleX is the current production source rather than an in-progress migration
**WHEN** a baseline-versus-StyleX parity test has no enduring public contract
**THEN** remove it instead of permanently paying its matrix cost.
