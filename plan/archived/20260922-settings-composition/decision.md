# Decisions: Settings Composition

| ID      | Title                                              | Status   |
| ------- | -------------------------------------------------- | -------- |
| DEC-001 | Use a dialog-backed navigation picker below tablet | accepted |
| DEC-002 | Expose identity header as a sidebar compound slot  | accepted |
| DEC-003 | Demonstrate setting actions in catalog examples    | accepted |
| DEC-004 | Use native control and alert dialog in examples    | accepted |
| DEC-005 | Use command search for time-zone selection         | accepted |

---

### DEC-001: Use a dialog-backed navigation picker below tablet

**GIVEN** a settings dialog or tablet viewport has insufficient width for a persistent sidebar

**WHEN** the viewport is below 768px

**THEN** show the current section as a dialog trigger and present navigation choices in the dialog.

---

### DEC-002: Expose identity header as a sidebar compound slot

**GIVEN** settings navigation may need avatar, account name, and supporting detail

**WHEN** a consumer supplies `SettingsSidebarHeader`

**THEN** render it above navigation in both desktop and compact dialog layouts without assigning meaning to its content.

---

### DEC-003: Demonstrate setting actions in catalog examples

**GIVEN** `SettingItem` accepts caller-owned actions

**WHEN** documenting settings composition

**THEN** provide dialog-backed configuration and inline edit examples without expanding the package component API.

---

### DEC-004: Use native control and alert dialog in examples

**GIVEN** setting actions must be usable in compact compositions

**WHEN** showing an inline choice edit or destructive action

**THEN** use `NativeSelect` for direct selection and `AlertDialog` for explicit confirmation.

---

### DEC-005: Use command search for time-zone selection

**GIVEN** time-zone choices grow beyond a compact static list

**WHEN** documenting the time-zone setting

**THEN** present searchable command results in the configuration dialog and commit the selected value immediately.
