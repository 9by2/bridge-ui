# Decisions: Phase 1 Clean Boundary

| ID      | Title                                        | Status   |
| ------- | -------------------------------------------- | -------- |
| DEC-001 | Plan one foundation phase at a time          | accepted |
| DEC-002 | Delete application-owned source              | accepted |
| DEC-003 | Decouple only reusable presentation          | accepted |
| DEC-004 | Keep generated Shadcn source unchanged       | accepted |
| DEC-005 | Use local import inside hand-authored source | accepted |
| DEC-006 | Pass copy through component contracts        | accepted |
| DEC-007 | Remove unapproved copied compositions        | accepted |
| DEC-008 | Defer generated type debt                    | accepted |

---

### DEC-001: Plan one foundation phase at a time

**GIVEN** the north star defines dependent foundation phases
**WHEN** implementation planning starts
**THEN** only Phase 1 is planned now and each later phase receives a separate proposal after the prior gate passes

---

### DEC-002: Delete application-owned source

**GIVEN** this repository contains studio, ticket, route, authorization, mapper, DTO, workflow, and product-i18n source
**WHEN** a module has an essential application responsibility
**THEN** remove it from this repository instead of adding a compatibility abstraction

---

### DEC-003: Decouple only reusable presentation

**GIVEN** some copied components combine reusable rendering with consumer dependencies
**WHEN** the rendering has a stable company-wide presentation contract
**THEN** retain it only after data, copy, child, and callback props replace application concerns

---

### DEC-004: Keep generated Shadcn source unchanged

**GIVEN** `app/component/shadcn/` is generated and must not be manually edited
**WHEN** generated source contains private aliases or a lint warning
**THEN** preserve it in Phase 1 and rely on its explicit lint exclusion until a future Shadcn CLI refresh

---

### DEC-005: Use local import inside hand-authored source

**GIVEN** `@bridge/ui/app/**` is a private repository path, not a public package contract
**WHEN** one hand-authored package module imports another
**THEN** use a valid local relative import that traverses no more than one parent directory

---

### DEC-006: Pass copy through component contracts

**GIVEN** product i18n belongs to each consumer application
**WHEN** a retained component renders visible copy
**THEN** receive that copy through prop or child and do not add package-owned product i18n

---

### DEC-007: Remove unapproved copied compositions

**GIVEN** copied global components have no approved package export contract or consumer evidence in this repository
**WHEN** Phase 1 classifies their ownership
**THEN** delete them instead of inventing reusable APIs, and recover a pattern through a future evidence-backed proposal when needed

---

### DEC-008: Defer generated type debt

**GIVEN** generated Shadcn source has existing type errors and Phase 1 cannot manually modify generated files
**WHEN** Phase 1 type safety is verified
**THEN** require boundary tooling and retained hand-authored source to typecheck, record generated failures, and resolve generated package compatibility through a later CLI refresh or package-foundation phase
