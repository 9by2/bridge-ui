# Decisions: Phase 3 Testable Storybook

| ID      | Title                               | Status   |
| ------- | ----------------------------------- | -------- |
| DEC-001 | One story file per generated module | accepted |
| DEC-002 | Import stories from package root    | accepted |
| DEC-003 | Run stories in Chromium             | accepted |
| DEC-004 | Use private fixture decorators      | accepted |

---

### DEC-001: One story file per generated module

**GIVEN** every generated module requires Storybook coverage
**WHEN** catalog completeness is checked
**THEN** require a story with the same basename for every file under `app/component/shadcn/`

---

### DEC-002: Import stories from package root

**GIVEN** Storybook is the first package consumer
**WHEN** a story imports a component
**THEN** import from `@bridge/ui` and never from a repository component path

---

### DEC-003: Run stories in Chromium

**GIVEN** static compilation cannot prove browser interaction
**WHEN** Storybook tests run
**THEN** execute all stories and play functions in headless Chromium through the Storybook Vitest addon

---

### DEC-004: Use private fixture decorators

**GIVEN** stories need theme, locale, motion, viewport, and provider context
**WHEN** fixture context is added
**THEN** keep it under Storybook/private tooling and do not add production container or product i18n
