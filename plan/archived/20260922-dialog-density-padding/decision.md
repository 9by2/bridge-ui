# Decisions: Dialog Density Padding

| ID      | Title                         | Status   |
| ------- | ----------------------------- | -------- |
| DEC-001 | Share the surface inset token | accepted |

---

### DEC-001: Share the surface inset token

**GIVEN** Theme density defines `--bridge-surface-padding` for dialog content

**WHEN** Dialog renders a footer

**THEN** footer padding and its compensating margins SHALL use `geometryToken.surfacePadding` rather than fixed pixel values.
