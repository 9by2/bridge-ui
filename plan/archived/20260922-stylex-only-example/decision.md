# Decisions: StyleX-Only Example

| ID      | Title                      | Status   |
| ------- | -------------------------- | -------- |
| DEC-001 | One catalog implementation | accepted |

---

### DEC-001: One catalog implementation

**GIVEN** public `@bridge/ui` exports resolve to owned StyleX components
**WHEN** a catalog example is loaded from any supported catalog URL
**THEN** it uses the same public StyleX module inventory with no normal/candidate mode selection
