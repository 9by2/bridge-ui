# Spec: Catalog CI Image

**Spec ID:** `catalog-ci-image`
**Proposal:** `catalog-ci-image-pin`
**Status:** accepted

## Summary

Required verification consumes a published multi-architecture catalog runtime by immutable OCI index digest.

## Requirements

### REQ-001: Immutable source

Child CI must use `registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime@sha256:19eddc384cca8f39c94290a0c161ac4c837683418ed288849444ea4eeb750200`.

**Acceptance:**

- [x] No mutable image tag is used by verification.

### REQ-002: No CI image build

Repository CI must not build or push the catalog runtime.

**Acceptance:**

- [x] Root CI has no catalog runtime image job.

### REQ-003: Architecture support

Runtime verification must pass when Docker selects either Linux amd64 or Linux arm64.

**Acceptance:**

- [x] Both platform-specific image executions pass.

## Schema / API

```text
registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime@sha256:19eddc384cca8f39c94290a0c161ac4c837683418ed288849444ea4eeb750200
```

## Examples

### Child verification image

**Input:** OCI index digest.

**Output:** native Linux image selected for runner architecture.

## Non-Goals

- Image publication automation.
