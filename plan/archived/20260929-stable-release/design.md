# Design: Stable Release

## Overview

Leave Changesets normal mode. The existing changesets-gitlab release job opens a stable version MR from pending changesets on protected `main`; merging that MR invokes the same job to publish the stable version, verify registry installation and tag the commit. Remove manual promotion and RC support.

## Architecture

```text
feature MR + changeset -> main CI -> stable version MR -> main CI -> latest + tag
```

## Components

| Component       | Responsibility                          | Location                    |
| --------------- | --------------------------------------- | --------------------------- |
| release job     | Prepare MR or publish on protected main | `deployment/.gitlab-ci.yml` |
| publisher       | Verify stable artifact and tag          | `cmd/publish-package.ts`    |
| release scripts | Version and publish via Changesets      | `package.json`              |

## Data Flow

1. Feature MR merges with changeset.
2. Protected main CI versions via changesets-gitlab and opens version MR.
3. Version MR merges, protected main CI publishes stable under latest and tags.

## Example Code

```sh
bun changeset version
bun install --lockfile-only
bun fmt
```

## Risks & Mitigations

| Risk                                         | Mitigation                                                 |
| -------------------------------------------- | ---------------------------------------------------------- |
| Existing RC state changes version resolution | Exit pre mode once and remove pre.json in migration commit |
| Duplicate pipeline publication               | Retain registry lookup and existing tag checks             |
