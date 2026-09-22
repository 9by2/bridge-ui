# Decisions: Catalog Bundle Splitting

| ID      | Title                              | Status   |
| ------- | ---------------------------------- | -------- |
| DEC-001 | Split catalog-only vendor families | accepted |
| DEC-002 | Enforce a lazy asset ceiling       | accepted |

---

### DEC-001: Split catalog-only vendor families

**GIVEN** the catalog has heavyweight visual and chart dependencies

**WHEN** building the static catalog

**THEN** assign them to stable manual chunks without altering package build output.

---

### DEC-002: Enforce a lazy asset ceiling

**GIVEN** Vite warnings can be missed in build logs

**WHEN** the catalog build completes

**THEN** keep the initial catalog entry below 500 kB and fail verification if a route-lazy asset exceeds 900 kB.
