# Local WebView Pre-Push

**Proposal:** `local-webview-pre-push`
**Status:** done
**Phase:** [ADHD quality](../../ADHD.md#5-quality)

## Problem

The complete Bun.WebView catalog suite runs substantially faster on contributor Apple Silicon than on the current Xeon CI runner, where it dominates pipeline duration.

## Scope

### In scope

- Move complete catalog WebView verification from CI to a repository-owned pre-push hook.
- Retain static catalog compilation in CI.
- Document and test hook installation and gate ownership.

### Out of scope

- Reducing catalog assertions.
- Automatically running package lifecycle scripts for published consumers.
- Preventing an explicit `git push --no-verify` bypass.

## Success Criteria

- [x] Installed pre-push hook runs `bun catalog:test`.
- [x] CI runs `bun catalog:build` without launching the complete WebView suite.
- [x] Setup and quality documentation identify the local gate and bypass risk.

## Specs

| Spec               | Path                              | Summary                                                                |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------- |
| local-webview-gate | `spec/local-webview-gate/spec.md` | Defines local complete WebView and CI static catalog responsibilities. |

## References

- [ADHD.md](../../ADHD.md)
- [CI catalog scope](../spec/ci-catalog-scope/spec.md)
