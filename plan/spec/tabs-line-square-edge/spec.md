# Spec: Tabs Line Square Edge

**Spec ID:** `tabs-line-square-edge`
**Proposal:** `tabs-line-square-edge`
**Status:** accepted

## Summary

Horizontal line Tabs use square-edged triggers to match their underline presentation.

## Requirements

### REQ-001: Horizontal line trigger radius

When a `TabsList` has `variant="line"` in horizontal orientation, every `TabsTrigger` has a `0px` computed border radius.

**Acceptance:**

- [x] Bun.WebView observes `0px` for an active horizontal line trigger.
