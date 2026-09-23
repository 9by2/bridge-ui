# Decisions: Release Merge Fast Path

| ID      | Title                                                                | Status   |
| ------- | -------------------------------------------------------------------- | -------- |
| DEC-001 | Skip source/coverage verify for release-automation merge commit only | accepted |

---

### DEC-001: Skip source/coverage verify for release-automation merge commit only

**GIVEN** the user asked to make merging `changeset-release/main` → `main` "skip verify state and
straight through release right away" since that commit "is only patch the version anyway"
**WHEN** the protected-`main` push pipeline's commit title exactly matches the `INPUT_COMMIT`
automation title (`chore: version package` or its `(rc)` variant) and the pipeline is the
`parent_pipeline` on the protected default branch
**THEN** set `when: never` on the `source` and `coverage` jobs for that exact condition, leaving
every other rule (including the release-MR's own pre-merge `merge_request_event` pipeline, the
`catalog` job, and the `release` job's protected-branch gate) unchanged. This does not weaken
pre-merge verification — the MR pipeline that gates the merge itself still runs full `source` and
`coverage`.

---
