# Decisions: Restore CI Coverage

| ID      | Title                      | Status   |
| ------- | -------------------------- | -------- |
| DEC-001 | Test public board controls | accepted |

---

### DEC-001: Test public board controls

**GIVEN** CI enforces runtime branch coverage
**WHEN** adding coverage
**THEN** exercise accessible, consumer-visible board behavior instead of private helpers.

---

### DEC-002: Enforce brand coverage by scope

**GIVEN** `coverage:brand` and `coverage:runtime` both execute the component suite
**WHEN** enforcing quality thresholds
**THEN** the brand command enforces its scoped aggregate while the runtime command retains package-wide thresholds.
