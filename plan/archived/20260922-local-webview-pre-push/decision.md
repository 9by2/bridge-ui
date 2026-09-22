# Decisions: Local WebView Pre-Push

| ID      | Title                          | Status   |
| ------- | ------------------------------ | -------- |
| DEC-001 | Run complete WebView locally   | accepted |
| DEC-002 | Install hooks explicitly       | accepted |
| DEC-003 | Retain static CI catalog build | accepted |

---

### DEC-001: Run complete WebView locally

**GIVEN** contributor Apple Silicon runs Bun.WebView substantially faster than the Xeon CI runner
**WHEN** a contributor pushes a change
**THEN** the repository pre-push hook runs the unchanged complete `bun catalog:test` suite.

---

### DEC-002: Install hooks explicitly

**GIVEN** this repository publishes its root package manifest
**WHEN** Git hook setup is provided
**THEN** use an explicit `bun hooks:install` command instead of a package lifecycle script that could affect consumers.

---

### DEC-003: Retain static CI catalog build

**GIVEN** local hooks are bypassable
**WHEN** child CI verifies a change
**THEN** CI still runs `bun catalog:build` to catch compilation and catalog bundle-size failures without WebView cost.
