# Decisions: Input Icon

| ID      | Title                              | Status   |
| ------- | ---------------------------------- | -------- |
| DEC-001 | Use a leading decorative icon prop | accepted |

---

### DEC-001: Use a leading decorative icon prop

**GIVEN** Input has no child composition surface and consumers need a concise leading icon.
**WHEN** a consumer passes `icon`.
**THEN** Input renders it as decorative content and keeps the native input as the public form control.

---

### DEC-002: Reserve InputGroup for interactive adornments

**GIVEN** an icon may need a button, shortcut, or trailing placement.
**WHEN** the adornment has behavior or layout beyond a decorative leading icon.
**THEN** consumers use InputGroup, InputGroupAddon, and InputGroupButton.
