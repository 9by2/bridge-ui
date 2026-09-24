# Decisions: Release Promote Fix

| ID      | Title                                                        | Status   |
| ------- | ------------------------------------------------------------ | -------- |
| DEC-001 | Promote opens a stable MR, never pushes main                 | accepted |
| DEC-002 | RC and stable are skippable                                  | accepted |
| DEC-003 | Stable is computed from main, not copied from an RC artifact | accepted |
| DEC-004 | Existing stable is a failure                                 | accepted |

---

### DEC-001: Promote opens a stable MR, never pushes main

**GIVEN** only Maintainers can push protected `main`
**WHEN** a human runs `promote`
**THEN** it pushes `changeset-release/stable` and creates/updates `Release @bridge/ui x.y.z (stable)`; merging it lets the existing `release` job publish under `latest` and tag.

### DEC-002: RC and stable are skippable

**GIVEN** teams may not cut or promote every RC
**WHEN** RC MRs are left unmerged, or the stable MR is closed
**THEN** pending changesets stay on `main`; the next RC or promote includes all of them.

### DEC-003: Stable is computed from main, not copied from an RC artifact

**GIVEN** the previous promote copied the RC build and never reset pre-mode state
**WHEN** promoting
**THEN** `changeset pre exit` + `version` + `pre enter rc` compute the stable and restart RC above it.

### DEC-004: Existing stable is a failure

**GIVEN** the 0924 incident exited green while publishing nothing
**WHEN** the computed stable is already in the registry
**THEN** promote fails with a repair instruction and pushes nothing.
