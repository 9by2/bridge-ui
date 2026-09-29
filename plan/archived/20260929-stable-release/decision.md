# Decisions: Stable Release

### DEC-001: Stable version MR

**GIVEN** protected `main` and existing release automation
**WHEN** a feature MR with a changeset merges
**THEN** CI creates a stable version MR; merging it publishes under `latest`, without manual promotion or RC.
