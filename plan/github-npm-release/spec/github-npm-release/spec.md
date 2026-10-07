# Spec: GitHub npm Release

**Spec ID:** `github-npm-release`
**Proposal:** `github-npm-release`
**Status:** draft

## Summary

GitHub Actions verifies the mirrored repository and publishes each GitLab-versioned stable release publicly as `@9by2/bridge-ui` on npmjs.org, with a matching GitHub Release.

## Requirements

### REQ-001 Verification gate

Pull requests to `main` and pushes to `main` run fmt, lint, typecheck, boundary, build, test, brand and runtime coverage, packed package, and tree-shaking verification. Release depends on verification.

### REQ-002 Guarded publication

Publication runs only when `GITHUB_ACTIONS=true`, `GITHUB_EVENT_NAME=push`, and `GITHUB_REF=refs/heads/main`. It also requires a stable `X.Y.Z` version and a `## X.Y.Z` CHANGELOG entry.

**Acceptance:** Local runs, pull requests, and RC versions are rejected before any registry request. A missing CHANGELOG entry publishes nothing.

### REQ-003 Public manifest

The published manifest is named `@9by2/bridge-ui`, has public access, carries the GitHub `repository`, and has no scripts or devDependencies. Exports, dependencies, and peerDependencies are unchanged.

### REQ-004 Idempotent release

A version already present on npm is not republished. The version must resolve and import from npm before the workflow reports `release=true`. The workflow creates GitHub Release `vX.Y.Z` only when it does not exist yet.

## Non-Goals

- GitHub-side version bumping.
- Changing the `@bridge/ui` GitLab release.
