# Decisions: Stable 0.3.0 Release

| ID      | Title                     | Status   |
| ------- | ------------------------- | -------- |
| DEC-001 | Promote the released RC   | accepted |
| DEC-002 | Keep publication CI-owned | accepted |

---

### DEC-001: Promote the released RC

**GIVEN** `v0.3.0-rc.0` exists at source `ddf92a8`
**WHEN** stable promotion begins
**THEN** use that fetched source as the promotion baseline and introduce no package behavior change.

---

### DEC-002: Keep publication CI-owned

**GIVEN** the accepted release contract assigns publication and tagging to protected default-branch CI
**WHEN** exiting Changesets pre-mode
**THEN** commit only the reviewed pre-state and plan record; do not version, publish, tag, or merge the release MR locally.
