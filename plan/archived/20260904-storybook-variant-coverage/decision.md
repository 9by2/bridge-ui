# Decisions: Storybook Variant Coverage

| ID      | Title                                 | Status   |
| ------- | ------------------------------------- | -------- |
| DEC-001 | Cover finite axes, not cross-products | accepted |
| DEC-002 | Use named variant stories             | accepted |
| DEC-003 | Enforce a canonical matrix            | accepted |

---

### DEC-001: Cover finite axes, not cross-products

**GIVEN** generated components expose multiple finite visual axes
**WHEN** complete variant coverage is defined
**THEN** render every axis value at least once without requiring every combinatorial permutation

---

### DEC-002: Use named variant stories

**GIVEN** default stories already cover one realistic composition
**WHEN** additional visual values are cataloged
**THEN** expose a discoverable `Variants` story in each affected module file

---

### DEC-003: Enforce a canonical matrix

**GIVEN** visual review alone cannot prove exhaustive coverage
**WHEN** tests run
**THEN** verify every matrix entry has a named story and explicit real fixture case
