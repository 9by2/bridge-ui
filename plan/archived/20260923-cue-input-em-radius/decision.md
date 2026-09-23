# Decisions: Cue Input Relative Radius

| ID      | Title                    | Status   |
| ------- | ------------------------ | -------- |
| DEC-001 | Font-relative Cue radius | accepted |

---

### DEC-001: Font-relative Cue radius

**GIVEN** Input uses a responsive font size and Theme owns its shared control radius
**WHEN** Cue Theme has no radius override
**THEN** its `0.5em` radius follows Input's responsive font size; explicit `em` overrides remain authoritative.
