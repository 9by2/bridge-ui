# Decisions: CI Catalog Scope

| ID      | Title                                   | Status   |
| ------- | --------------------------------------- | -------- |
| DEC-001 | Prefer MR pipeline over branch pipeline | accepted |
| DEC-002 | Skip catalog for chore commits          | accepted |

---

### DEC-001: Prefer MR pipeline over branch pipeline

**GIVEN** GitLab can create both push and merge-request pipelines for the same MR commit
**WHEN** the branch has an open merge request
**THEN** suppress its push pipeline and retain the merge-request pipeline.

---

### DEC-002: Skip catalog for chore commits

**GIVEN** the catalog suite is a full Linux browser verification gate and takes 15-18 minutes in CI
**WHEN** a conventional `chore` commit triggers verification
**THEN** omit only the catalog job; retain the complete suite for non-chore MR and default-branch commits.
