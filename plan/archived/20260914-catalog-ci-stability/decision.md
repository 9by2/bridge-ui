# Decision

### DEC-001: Preserve The Gate

**GIVEN** isolated execution passes but CI fails
**WHEN** correcting catalog verification
**THEN** preserve the default assertion timeout, zero retry, and full example inventory; prove the correction against the complete constrained workload.

### DEC-002: Shared Runner Budget

**GIVEN** job 247106 uses Docker on an ARM Mac Mini and the config unconditionally starts four browser workers
**WHEN** the suite runs in CI
**THEN** use one worker, following Playwright's CI reproducibility recommendation, without changing component behavior or readiness assertions.
