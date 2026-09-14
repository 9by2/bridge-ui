# Decisions: Tabs Border Bottom

| ID      | Title                          | Status   |
| ------- | ------------------------------ | -------- |
| DEC-001 | Separate border-bottom variant | accepted |
| DEC-002 | Compose rich tab labels        | accepted |

---

### DEC-001: Separate border-bottom variant

**GIVEN** `line` represents only the active tab underline
**WHEN** a caller requests `border-bottom`
**THEN** the list draws a full neutral bottom rule and the active trigger draws only a primary-color underline

---

### DEC-002: Compose rich tab labels

**GIVEN** count badges and status icons are tab content rather than selection behavior
**WHEN** the catalog demonstrates richer navigation tabs
**THEN** callers compose Badge and icon children inside TabsTrigger without adding content-specific variants
