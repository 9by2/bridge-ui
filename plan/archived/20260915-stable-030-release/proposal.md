# Stable 0.3.0 Release

**Proposal:** `stable-030-release`
**Status:** done
**Phase:** [ADHD Private Package](../../ADHD.md#4-private-package)

## Problem

`@bridge/ui` 0.3.0-rc.0 is published and tagged, but the repository remains in Changesets RC mode. Stable publication requires an explicit reviewed pre-mode exit and complete repository verification before protected-main automation prepares 0.3.0 under `latest`.

## Scope

### In scope

- Record the exact RC source and version selected for promotion.
- Exit Changesets RC mode without manually changing package version.
- Run every repository release gate required by ADHD.
- Commit and push the reviewed stable-promotion state to `main`.

### Out of scope

- Local publication, manual tag creation, or release-MR merge.
- Consumer migration or unrelated package behavior change.

## Success Criteria

- [x] RC source `ddf92a8` and version `0.3.0-rc.0` are recorded.
- [x] Changesets pre-mode is exited through the pinned Bun command.
- [x] Format, lint, typecheck, test, coverage, catalog, and package gate pass.
- [x] Protected-main automation can prepare the reviewed stable 0.3.0 release MR.

## Specs

| Spec                | Path                             | Summary                                                      |
| ------------------- | -------------------------------- | ------------------------------------------------------------ |
| `changeset-release` | `spec/changeset-release/spec.md` | Stable promotion amendment to the accepted release contract. |

## References

- [Release process](../../README.md#stable)
- [Canonical release contract](../spec/changeset-release/spec.md)
- Tag `v0.3.0-rc.0`
