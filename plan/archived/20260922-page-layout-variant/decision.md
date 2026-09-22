# Decisions: Page Layout Variant

| ID      | Title                        | Status   |
| ------- | ---------------------------- | -------- |
| DEC-001 | Default to full-width layout | accepted |

---

### DEC-001: Default to full-width layout

**GIVEN** `Page` is a reusable presentation component and applications own page composition
**WHEN** a consumer renders `Page` without a layout variant
**THEN** it has no max-width cap or automatic inline centering; `variant="container"` explicitly restores the constrained centered layout.
