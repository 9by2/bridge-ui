# Shell Header

**Proposal:** `shell-header`
**Status:** completed
**Phase:** [ADHD StyleX Bundle and Private Package](../../ADHD.md#3-stylex-bundle)

## Problem

Application shell routes need a compact sticky header inside `SidebarInset`. `PageHeader` is intentionally a large in-page heading and cannot satisfy this shell contract. `SidebarInset` also lacks the flex-item minimum width needed to shrink beside the desktop sidebar gap.

## Scope

### In scope

- Public StyleX `ShellHeader`, `ShellHeaderTitle`, and `ShellHeaderAction` primitives.
- `SidebarInset` remaining-width and overflow correction.
- Catalog, component, browser, packed-package, and release-candidate verification.

### Out of scope

- Changing `PageHeader` semantics.
- Bridge Admin source changes or application-specific behavior.
- Changing the existing Sidebar API.

## Success Criteria

- [x] Acceptance composition renders through the public package API and direct StyleX path.
- [x] Expanded, collapsed, wide-content, sticky, mobile, long-title, action, light, and dark behavior pass browser verification.
- [x] Repository quality gate passes and a Changeset prepares the next release candidate.

## Specs

| Spec         | Path                        | Summary                                               |
| ------------ | --------------------------- | ----------------------------------------------------- |
| shell-header | `spec/shell-header/spec.md` | Public shell header and SidebarInset layout contract. |

## References

- [ADHD.md](../../ADHD.md)
- [README release process](../../README.md#release-process)
