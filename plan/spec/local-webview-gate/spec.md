# Spec: Local WebView Gate

**Spec ID:** `local-webview-gate`
**Proposal:** `local-webview-pre-push`
**Status:** accepted

## Summary

Defines compact Bun.WebView catalog contracts as a repository pre-push gate, exhaustive static catalog compilation as the retained CI gate, and explicit visual/memory diagnostics.

## Requirements

### REQ-001: Repository hook

The repository-owned pre-push hook SHALL run compact `bun catalog:test` browser contracts and propagate its exit status.

**Acceptance:**

- [ ] `.githooks/pre-push` is executable.
- [ ] The hook uses an OS-assigned catalog server port by default.
- [ ] A failed catalog suite blocks a normal push.
- [ ] Visual and memory diagnostics are exposed by independent commands.

### REQ-002: Explicit installation

The repository SHALL expose `bun hooks:install` to configure `core.hooksPath` without a package lifecycle script.

**Acceptance:**

- [ ] Setup documentation includes the install command.
- [ ] The published manifest has no hook-mutating `postinstall` or `prepare` script.

### REQ-003: CI static verification

The child pipeline catalog job SHALL run `bun catalog:build` and SHALL NOT run `bun catalog:test`.

**Acceptance:**

- [ ] Catalog compilation and bundle-size checks remain blocking in CI.
- [ ] CI does not launch the complete Bun.WebView catalog suite.

## Non-Goals

- Making Git hooks impossible to bypass.
- Reducing complete catalog coverage.
