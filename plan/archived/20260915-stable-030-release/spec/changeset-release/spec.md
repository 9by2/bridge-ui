# Spec: Changeset Release

**Spec ID:** `changeset-release`
**Proposal:** `stable-030-release`
**Status:** accepted

## Summary

Amends the accepted release contract with the exact 0.3.0 stable-promotion record.

## Requirements

### REQ-001 Stable promotion baseline

Stable 0.3.0 promotion uses the published `v0.3.0-rc.0` source at `ddf92a8` with all pending minor Changesets consumed.

**Acceptance:**

- [x] Tag, source, package version, and consumed Changeset state are confirmed from fetched Git history.

### REQ-002 Explicit pre-mode exit

The repository exits RC mode through `bun changeset pre exit`. Package version remains RC locally until release automation applies the stable version in its release MR.

**Acceptance:**

- [x] Pre-state records exit mode.
- [x] No package version or release tag is manually changed.

### REQ-003 Protected publication

Only protected default-branch CI may prepare and publish 0.3.0 under `latest`, verify isolated registry installation, and create `v0.3.0` after publication.

**Acceptance:**

- [x] Local change contains no publication or tag side effect.

## Schema / API

```json
{
  "mode": "exit",
  "tag": "rc",
  "initialVersions": {
    "@bridge/ui": "0.2.0"
  },
  "changesets": ["calm-stages-glow", "silly-tabs-rest", "tidy-shells-stick"]
}
```

## Non-Goals

- Manual publication, version application, tag creation, or release-MR approval.
