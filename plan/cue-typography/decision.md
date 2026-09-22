# Decisions: Cue Typography

| ID      | Title                             | Status   |
| ------- | --------------------------------- | -------- |
| DEC-001 | Preserve Cue's small semantic API | accepted |

---

### DEC-001: Preserve Cue's small semantic API

**GIVEN** Cue already has `Heading`, `Label`, and `Body` primitives with an established semantic contract.

**WHEN** Bridge UI promotes this typography.

**THEN** it exports the same component names, `WAIHeading` values, default `h4`, heading sizes, and body leading while replacing Tailwind implementation with Bridge StyleX tokens.

---

### DEC-002: Catalog headings use the shared primitive

**GIVEN** catalog examples demonstrate public component composition.

**WHEN** an example introduces a semantic document heading.

**THEN** it uses `Heading` with the matching `WAIHeading` level, including content that follows a `PageHeader`.
