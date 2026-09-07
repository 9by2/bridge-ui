# Task

- [x] Add validation and protected prerelease deployment contract.
- [x] Test release guard and validate YAML with GitLab.
- [x] Run required local check and record known failure for the single checkpoint commit.
- [ ] Verify first runner execution and registry publication after foundation gate passes.

Local verification: formatting, lint (ten generated warning), typecheck, boundary, 15 Bun test, brand coverage, 375 browser check and packed build pass. Repository coverage fails the unchanged 90% floor. Parent and child YAML both accepted by project 872 CI lint API. Linux visual baseline and mirrored Bun image are not locally proven. Generated/vendor formatter churn was removed and excluded from formatter ownership.
