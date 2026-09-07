# Decision

## DEC-001: Release Approval

**GIVEN** manual version and tag coordination confused the release workflow
**WHEN** a Changeset reaches protected main
**THEN** CI maintains one release MR; merging it approves publication after verification. Tag creation follows publication, never triggers it.

## DEC-002: Authentication

**GIVEN** CI_JOB_TOKEN can publish but cannot generally maintain an MR
**WHEN** enabling automation
**THEN** require a masked protected project bot GITLAB_TOKEN with API and repository write access. Do not create or expose a token locally.

## DEC-003: Compatible Pre-State

**GIVEN** changesets-gitlab 0.14.0 reads the v2 consumed-note state
**WHEN** selecting the CLI
**THEN** pin Changesets 2.29.8, test RC entry/version/exit in an isolated fixture, and upgrade the integration and CLI together. Publish uses the existing isolated Bun implementation with registry lookup for retry safety; disable optional GitLab Release creation while retaining Git tag push.
