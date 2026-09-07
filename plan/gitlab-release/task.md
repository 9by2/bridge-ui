# Task

- [x] Reproduce CI in Linux Docker, provide real Node for V8 coverage and capture reviewed Linux visual baseline.

Docker proof: upstream oven/bun:1.4.0 linux/amd64 (private mirror denied local pull), clean frozen install, Node 22.22.0 installed by checksum-verified helper. Complete source sequence passed; 375 browser check passed twice, second run without snapshot update. Repository coverage executes but fails: statement 21.12%, branch 21.84%, function 15.22%, line 20.73%. No threshold relaxed.

- [x] Add validation and protected prerelease deployment contract.
- [x] Test release guard and validate YAML with GitLab.
- [x] Run required local check and record known failure for the single checkpoint commit.
- [ ] Verify first runner execution and registry publication after foundation gate passes.
- [x] Load concurrency override in parent/child; relocate private command to cmd and verify reference/root resolution.

Local verification: formatting, lint (ten generated warning), typecheck, boundary, 15 Bun test, brand coverage, 375 browser check and packed build pass. Repository coverage fails the unchanged 90% floor. Parent and child YAML both accepted by project 872 CI lint API. Linux visual baseline and mirrored Bun image are not locally proven. Generated/vendor formatter churn was removed and excluded from formatter ownership.
