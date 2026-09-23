# Decision

### DEC-001: No hidden diagnostics

**GIVEN** a scanner warning on generated or external source
**WHEN** changing source would violate ownership or published contracts
**THEN** document the exact blocker and leave the warning visible rather than disabling a rule.
