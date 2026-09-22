# Decisions: Cue Button Default Parity

| ID      | Title                           | Status   |
| ------- | ------------------------------- | -------- |
| DEC-001 | Keep Cue recipe local to Bridge | accepted |

---

### DEC-001: Keep Cue recipe local to Bridge

**GIVEN** Bridge must not import `@cue/web` or consumer source.
**WHEN** its public Button adopts Cue default styling.
**THEN** Bridge declares a Cue-derived recipe locally and verifies the rendered Cue mode.
