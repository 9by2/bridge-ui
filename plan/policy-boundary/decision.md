# Decision: Policy Boundary

| ID      | Title                               | Status   |
| ------- | ----------------------------------- | -------- |
| DEC-001 | Split policy by enforcement layer   | accepted |
| DEC-002 | Preserve generated Shadcn exemption | accepted |

---

### DEC-001: Split policy by enforcement layer

**GIVEN** agent workflow, architecture, and enforceable code rule are mixed in one file
**WHEN** repository policy is documented
**THEN** AGENTS own agent workflow, ADHD own the north star and ideal contract, README own current project fact, and Oxlint own supported deterministic rule

---

### DEC-002: Preserve generated Shadcn exemption

**GIVEN** `app/component/shadcn/` is CLI-generated source
**WHEN** strict hand-authored code rule run
**THEN** the generated directory is excluded and must not be manually changed
