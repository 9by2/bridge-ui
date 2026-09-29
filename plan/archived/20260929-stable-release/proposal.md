# Stable Release

**Proposal:** `stable-release`
**Status:** done

## Problem

Permanent RC mode and manual promotion delay stable delivery after a feature MR merges.

## Scope

- Exit Changesets pre mode and remove the manual promotion path.
- Automatically prepare a stable version MR after pending changesets land on `main`.
- Publish only stable versions under `latest` when the version MR merges.
- Preserve protected-branch, verification, registry-install and tag gates.

## Success Criteria

- [x] A changeset merged into `main` creates a stable version MR.
- [x] Merging the version MR publishes stable under `latest` and tags it.
- [x] No RC or manual promotion job remains.

## Specs

| Spec           | Path                          | Summary                      |
| -------------- | ----------------------------- | ---------------------------- |
| stable-release | `spec/stable-release/spec.md` | Stable-only release contract |

## References

- [ADHD.md](../../ADHD.md)
- [Previous release contract](../spec/rc-release-promotion/spec.md)
