# Design

Protected default branch -> required verification -> serialized release automation -> update release MR or publish versioned package. Use an existing GitLab Changesets integration rather than a custom MR bot. Package registry authentication remains CI_JOB_TOKEN; GITLAB_TOKEN authenticates branch/MR/tag automation. Prerelease uses next and stable uses latest. Registry verification remains isolated.

```sh
bun changeset
bun changeset pre enter rc
# Merge feature/pre-mode MR, then review the generated release MR.
bun changeset pre exit
```
