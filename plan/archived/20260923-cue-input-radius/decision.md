# Decisions: Cue Input Radius

| ID      | Title               | Status   |
| ------- | ------------------- | -------- |
| DEC-001 | Cue control default | accepted |

---

### DEC-001: Cue control default

**GIVEN** Cue Input and Textarea both use `rounded-lg` and owned controls consume `--bridge-control-radius`
**WHEN** a Cue Theme has no explicit control-radius override
**THEN** the control-radius variable defaults to 8px; an explicit override takes precedence.
