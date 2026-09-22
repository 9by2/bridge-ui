# Spec: Runtime Coverage

**Spec ID:** `runtime-coverage`
**Proposal:** `restore-ci-coverage`
**Status:** accepted

## Summary

The package runtime suite must retain at least 90% statements, branches, functions, and lines without lowering verification thresholds.

## Requirements

### REQ-001: Board behavior coverage

Board controls and callbacks are verified through their public React interface.

**Acceptance:**

- [ ] Tests interact with accessible board controls.
- [ ] `bun coverage:runtime` passes configured thresholds.

## Non-Goals

- Changing product behavior.
- Reducing coverage requirements.
