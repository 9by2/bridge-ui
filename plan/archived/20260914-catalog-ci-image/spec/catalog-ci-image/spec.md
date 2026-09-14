# Spec: Catalog CI Image

**Spec ID:** `catalog-ci-image`
**Proposal:** `catalog-ci-image`
**Status:** accepted

## Summary

This spec defines the prebuilt Linux runtime used by required Bridge UI verification job.

## Requirements

### REQ-001: Pinned runtime

The image must contain Bun 1.4.1, Node 22.22.0 and the Chromium revision required by Playwright 1.63.0.

**Acceptance:**

- [x] Runtime verification fails on version drift.
- [x] Existing Linux visual baseline passes without regeneration.

### REQ-002: No per-job browser provisioning

Catalog CI must execute Playwright without downloading Chromium or installing browser system dependency.

**Acceptance:**

- [x] Catalog job has no `playwright install` command.

### REQ-003: Full browser contract

Playwright remains the required runner for the full browser suite. Bun.WebView may provide targeted verification but cannot replace the gate without equivalent coverage and diagnostic evidence.

**Acceptance:**

- [x] Existing Playwright case and artifact remain enabled.

### REQ-004: Architecture

The published image must support Linux arm64 used by the project runner.

**Acceptance:**

- [x] Image build and runtime architecture check pass on arm64.

## Schema / API

```text
$CI_REGISTRY_IMAGE/ci/catalog:playwright-1.63.0-bun-1.4.1
```

## Examples

### Catalog job

**Input:** versioned runtime image and repository checkout.

**Output:** unchanged Playwright list/HTML report and failure trace contract.

## Non-Goals

- Replacing Playwright with Bun.WebView.
- Persisting `node_modules` between job.
