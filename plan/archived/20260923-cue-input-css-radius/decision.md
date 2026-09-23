# Decisions: Cue Input CSS Radius

| ID      | Title                           | Status   |
| ------- | ------------------------------- | -------- |
| DEC-001 | Stylesheet owns radius defaults | accepted |

---

### DEC-001: Stylesheet owns radius defaults

**GIVEN** the package stylesheet defines `--bridge-control-radius`
**WHEN** Theme renders without a caller radius override
**THEN** Theme does not shadow the CSS default inline; Cue mode uses `0.5em` from the stylesheet.
