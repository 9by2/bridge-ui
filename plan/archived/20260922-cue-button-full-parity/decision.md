# Decisions: Cue Button Full Parity

| ID      | Title                                    | Status   |
| ------- | ---------------------------------------- | -------- |
| DEC-001 | Translate all Cue Button styling locally | accepted |

---

### DEC-001: Translate all Cue Button styling locally

**GIVEN** Bridge cannot import Cue runtime source.
**WHEN** the public Button requires Cue parity.
**THEN** every Cue root, variant, size, and interaction declaration is represented in Bridge's StyleX recipe and checked in Cue mode.
