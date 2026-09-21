# Decisions: Flip Text

| ID      | Title                            | Status   |
| ------- | -------------------------------- | -------- |
| DEC-001 | Ship an actual 3D flip animation | accepted |
| DEC-002 | Segment Unicode graphemes        | accepted |
| DEC-003 | Keep one semantic text copy      | accepted |

---

### DEC-001: Ship an actual 3D flip animation

**GIVEN** the added source sets per-character animation custom properties but has no keyframe or animation declaration
**WHEN** promoting it to an owned component
**THEN** define a StyleX rotate-X keyframe that consumes those timing variables and disables motion through a reduced-motion media query.

---

### DEC-002: Segment Unicode graphemes

**GIVEN** UTF-16 `split("")` separates Thai combining marks and emoji modifiers
**WHEN** calculating visual character units
**THEN** use `Intl.Segmenter` with `granularity: "grapheme"`.

---

### DEC-003: Keep one semantic text copy

**GIVEN** independently animated characters are not useful semantic content
**WHEN** rendering the animated visual layer
**THEN** mark that layer aria-hidden and provide one visually-hidden plain-text copy.
