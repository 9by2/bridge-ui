# Decisions: Card Radius

| ID      | Title                             | Status   |
| ------- | --------------------------------- | -------- |
| DEC-001 | Expose four ordered radius values | accepted |

---

### DEC-001: Expose four ordered radius values

**GIVEN** Card needs configurable surface geometry while preserving its existing default.

**WHEN** a consumer selects `radius`.

**THEN** Card supports `none`, `sm`, `default`, and `lg`, where `none` is the smallest and `default` remains 14px.
