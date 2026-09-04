# Decisions: Phase 2 Package Foundation

| ID      | Title                                      | Status   |
| ------- | ------------------------------------------ | -------- |
| DEC-001 | Refresh generated source atomically        | accepted |
| DEC-002 | Export components from package root        | accepted |
| DEC-003 | Separate JavaScript and declaration builds | accepted |
| DEC-004 | Verify only packed artifacts               | accepted |
| DEC-005 | Stabilize CSS subpath before StyleX        | accepted |

---

### DEC-001: Refresh generated source atomically

**GIVEN** generated Shadcn modules are a mixed incompatible snapshot
**WHEN** compatibility is repaired
**THEN** use one Shadcn CLI refresh for all existing components and never manually patch generated files

---

### DEC-002: Export components from package root

**GIVEN** consumers must not import repository paths
**WHEN** a generated component is public
**THEN** export it from `@bridge/ui` root and verify export inventory completeness

---

### DEC-003: Separate JavaScript and declaration builds

**GIVEN** Bun bundles JavaScript but does not provide the required declaration contract
**WHEN** the package builds
**THEN** use Bun for ESM output and TypeScript for declaration-only output

---

### DEC-004: Verify only packed artifacts

**GIVEN** workspace aliases can hide missing files and invalid exports
**WHEN** consumer compatibility is tested
**THEN** install a `bun pm pack` tarball into isolated fixtures and never import workspace source directly

---

### DEC-005: Stabilize CSS subpath before StyleX

**GIVEN** StyleX arrives in Phase 4
**WHEN** Phase 2 defines package CSS
**THEN** expose `@bridge/ui/style.css` now so Phase 4 can replace CSS generation without changing consumers
