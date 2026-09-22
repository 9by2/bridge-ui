# Decisions: Theme Customization

| ID      | Title                                          | Status   |
| ------- | ---------------------------------------------- | -------- |
| DEC-001 | CSS custom properties are the runtime contract | accepted |
| DEC-002 | Customization is scoped and portal-aware       | accepted |
| DEC-003 | P0 migration is explicit                       | accepted |

---

### DEC-001: CSS custom properties are the runtime contract

**GIVEN** Bridge UI ships statically extracted StyleX CSS without a consumer compiler requirement
**WHEN** a consumer customizes a theme
**THEN** the package applies documented `--bridge-*` properties on Theme boundaries and recipes consume those properties.

---

### DEC-002: Customization is scoped and portal-aware

**GIVEN** consumer applications can embed differently branded or dense workflows
**WHEN** a Theme is nested or package content renders in a portal
**THEN** the nearest resolved Theme values apply without global selectors or source copying.

---

### DEC-003: P0 migration is explicit

**GIVEN** existing recipes contain many fixed values and generated source cannot be manually edited
**WHEN** this contract is released
**THEN** only Button, Input, Textarea, Card, Dialog, Popover, Toast, and Sonner are documented as P0 supported.
