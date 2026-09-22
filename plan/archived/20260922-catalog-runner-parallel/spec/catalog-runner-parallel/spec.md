# Spec: Catalog Runner Parallel

**Spec ID:** `catalog-runner-parallel`
**Proposal:** `catalog-runner-parallel`
**Status:** accepted

## Summary

Defines bounded parallel execution and actionable preview lifecycle failures for the complete catalog browser suite.

## Requirements

### REQ-001: Bounded parallel cases

The catalog runner must execute browser test files in parallel with at most two isolated workers while preserving serial cases within each file.

**Acceptance:**

- [ ] The runner passes `--parallel=2` to Bun test without global test concurrency.

### REQ-002: Static server lifecycle

The runner must serve the built catalog through Bun and stop the server after the browser test process exits.

**Acceptance:**

- [ ] The runner uses `Bun.serve` for the built catalog.
- [ ] The server is stopped after testing.

## Non-Goals

- Retrying tests.
- Increasing browser assertion timeouts.
