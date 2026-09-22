# Decisions: Dialog Background Token

| ID      | Title                        | Status   |
| ------- | ---------------------------- | -------- |
| DEC-001 | Keep surface as the fallback | accepted |

---

### DEC-001: Keep surface as the fallback

**GIVEN** existing themes provide surface colors but no Dialog-specific colors

**WHEN** Dialog is rendered without a Dialog color override

**THEN** it SHALL use the existing surface and surface-foreground values.
