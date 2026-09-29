# Spec: Stable Release

**Spec ID:** `stable-release`
**Proposal:** `stable-release`
**Status:** accepted

## Summary

Changesets runs in normal mode. Merging a feature MR with a changeset automatically opens a stable version MR. Merging the version MR publishes the exact stable version under `latest` and tags its merge commit.

## Requirements

### REQ-001 Automatic stable version MR

Protected default-branch CI runs Changesets version automation when pending notes exist. No pre mode or manual promotion is required.

**Acceptance:** A merged minor changeset from 0.13.1 produces 0.14.0 in the release MR.

### REQ-002 Stable publication

Publication requires a protected default branch, a stable version and a matching changelog entry. It publishes under `latest`, verifies installation and tags `vX.Y.Z`. Retries must not duplicate publication.

**Acceptance:** RC versions are rejected; missing changelog and unprotected branches do not publish.

## Non-Goals

- Direct CI push to protected main.
- Automatic merge of the version MR.
