# Decisions: Catalog Runner Parallel

| ID      | Title                              | Status   |
| ------- | ---------------------------------- | -------- |
| DEC-001 | Use bounded test-level concurrency | accepted |
| DEC-002 | Serve catalog with Bun             | accepted |

---

### DEC-001: Use bounded test-level concurrency

**GIVEN** the largest catalog test file contains hundreds of serial cases
**WHEN** running catalog browser verification
**THEN** use two isolated test-file workers. Preserve serial execution within each file because the large chart inventory shares browser rendering resources.

---

### DEC-002: Serve catalog with Bun

**GIVEN** Vite preview returns intermittent HTTP failures under concurrent heavyweight catalog asset requests
**WHEN** the browser suite serves the static build
**THEN** use Bun's in-process static server and stop it once testing completes.

---
