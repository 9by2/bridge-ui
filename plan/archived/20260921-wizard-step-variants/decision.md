# Decisions: Wizard Step Variants

| ID      | Title                                        | Status   |
| ------- | -------------------------------------------- | -------- |
| DEC-001 | Coordinate compound variants through context | accepted |

---

### DEC-001: Coordinate compound variants through context

**GIVEN** WizardStep is a manually composed compound component.
**WHEN** a root variant changes the layout of multiple slots.
**THEN** a private context supplies the presentation value so consumers do not repeat variant flags on each slot.
