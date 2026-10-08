# GitHub npm Release

**Proposal:** `github-npm-release`
**Status:** in-progress
**Phase:** [ADHD.md](../../ADHD.md) — 4. Private Package (public mirror channel)

## Problem

The repository is now mirrored to the public GitHub repository `9by2/bridge-ui`. Nothing verifies or releases from GitHub, so anyone outside the GitLab network cannot install the package.

## Scope

### In scope

- A GitHub Actions workflow that verifies every pull request and every push to `main`.
- Publish the GitLab-versioned release publicly to npmjs.org as `@9by2/bridge-ui`, with provenance.
- Create a `vX.Y.Z` GitHub Release using the matching CHANGELOG section.
- Make retries idempotent: an already published version or an existing release is never duplicated.

### Out of scope

- Changing GitLab versioning or the `@bridge/ui` GitLab registry release (GitLab stays primary).
- Renaming the source package or internal `@bridge/ui` import alias.
- GitHub-side Changesets version PRs.

## Success Criteria

- [ ] Pull requests and `main` pushes run the same source/coverage/package gate as GitLab.
- [ ] A mirrored `main` commit with an unpublished stable version and matching CHANGELOG entry publishes `@9by2/bridge-ui@X.Y.Z` under `latest` and creates GitHub Release `vX.Y.Z`.
- [ ] Rerunning the workflow for a released version publishes nothing.
- [ ] Publication refuses to run outside GitHub Actions `main` push context.

## Specs

| Spec               | Path                              | Summary                                |
| ------------------ | --------------------------------- | -------------------------------------- |
| github-npm-release | `spec/github-npm-release/spec.md` | Public npm mirror publication contract |

## References

- [plan/spec/stable-release/spec.md](../spec/stable-release/spec.md)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements)
