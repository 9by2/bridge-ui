# Decisions: Resizable Sheet

| ID      | Title                   | Status   |
| ------- | ----------------------- | -------- |
| DEC-001 | Use native CSS resizing | accepted |

---

### DEC-001: Use native CSS resizing

**GIVEN** Sheet dimensions are local presentation state with no persistence requirement.
**WHEN** a consumer requests a resizable sheet.
**THEN** `SheetContent` exposes browser-native resize behavior through an opt-in boolean instead of adding drag state or a new dependency.
