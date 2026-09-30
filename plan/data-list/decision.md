# Decisions: Generic Data List

| ID      | Title                                     | Status   |
| ------- | ----------------------------------------- | -------- |
| DEC-001 | Metadata-driven responsive rows           | accepted |
| DEC-002 | Variants distinguish layout and container | accepted |

---

### DEC-001: Metadata-driven responsive rows

**GIVEN** mobile cards need column labels and desktop table semantics
**WHEN** a consumer provides columns and row data
**THEN** the component renders table headers/cells on desktop and labelled definition-list entries on narrow screens.

### DEC-002: Variants distinguish layout and container

**GIVEN** data lists can be nested in cards, standalone, or dense overlays
**WHEN** a consumer chooses `variants`
**THEN** `table`, `card`, and `auto` select presentation while `density` and `framed` independently support dense and nested compositions.
