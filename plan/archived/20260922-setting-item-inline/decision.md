# Decisions: Setting Item Inline Variant

| ID      | Title                            | Status   |
| ------- | -------------------------------- | -------- |
| DEC-001 | Keep values consumer-owned       | accepted |
| DEC-002 | Preserve supporting descriptions | accepted |

---

### DEC-001: Keep values consumer-owned

**GIVEN** this package owns presentation rather than account state

**WHEN** an inline row displays an account value or edit control

**THEN** callers provide it through the existing `SettingItemAction` slot.

---

### DEC-002: Preserve supporting descriptions

**GIVEN** compact rows may still need explanatory copy

**WHEN** an inline item includes `SettingItemDescription`

**THEN** it renders below the title without moving the action from the first row.
