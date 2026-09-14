# Spec: Catalog CI Image

**Spec ID:** `catalog-ci-image`
**Proposal:** `catalog-ci-image-pin`
**Status:** accepted

## Summary

Required verification consumes a published multi-architecture catalog runtime by immutable OCI index digest.

## Requirements

### REQ-001: Immutable source

Child CI must use `registry.fountain.sellsuki.com/service/bridge-ui-catalog-runner@sha256:887a2a4f53dd81fb6cada6384e5075e18a938ff07999d65a5115378e1a74ef8c`.

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
registry.fountain.sellsuki.com/service/bridge-ui-catalog-runner@sha256:887a2a4f53dd81fb6cada6384e5075e18a938ff07999d65a5115378e1a74ef8c
```

## Examples

### Child verification image

**Input:** OCI index digest.

**Output:** native Linux image selected for runner architecture.

## Non-Goals

- Image publication automation.
