# Task

- [x] Add regression and explicit parent-pipeline rule for source, coverage and catalog so the release MR can validate.

MR child rule regression failed before the fix and passes after it. Formatting, typecheck and diff check pass. Actual MR child creation must be verified after this change reaches main and the bot refreshes the release MR; retrying the old commit cannot load this fix.

- [x] Test package runtime scope, command/catalog CI retention and mobile hook behavior.
- [x] Rename coverage command, update policy and verify the separate gate.

Runtime gate verification: 21 component test pass, with 100% statement, branch, function and line coverage including the mobile hook. Bun test, typecheck, lint, boundary, catalog, packed client/SSR and tree-shaking verification pass. Minor Changeset `runtime-quality-gate` is pending for `@bridge/ui`, confirmed by `bunx changeset status`; no version application or publication performed. The non-fatal Vite shutdown warning remains. Remote verification is pending; earlier repository percentage below is historical and superseded by the approved runtime policy.

- [x] Add a failing regression for generated Shadcn coverage exclusion.
- [x] Exclude generated Shadcn source, align ownership policy and measure remaining owned coverage without lowering the gate.

Ownership correction verification: regression fails before exclusion and passes after it; formatting, lint and typecheck pass. Local repository report contains no generated Shadcn component. All 20 component test pass; brand remains 100%. Remaining repository coverage: statement 26.14%, branch 32.55%, function 32.5%, line 26.85%. Owned command and catalog execution is not collected by this component-only Vitest suite; the 90% gate still blocks publication. Vite close timeout remains separate from threshold failure.

- [x] Reproduce CI in Linux Docker, provide real Node for V8 coverage and capture reviewed Linux visual baseline.

Docker proof: upstream oven/bun:1.4.0 linux/amd64 (private mirror denied local pull), clean frozen install, Node 22.22.0 installed by checksum-verified helper. Complete source sequence passed; 375 browser check passed twice, second run without snapshot update. Repository coverage executes but fails: statement 21.12%, branch 21.84%, function 15.22%, line 20.73%. No threshold relaxed.

- [x] Add validation and protected prerelease deployment contract.
- [x] Test release guard and validate YAML with GitLab.
- [x] Run required local check and record known failure for the single checkpoint commit.
- [ ] Verify first runner execution and registry publication after foundation gate passes.
- [x] Load concurrency override in parent/child; relocate private command to cmd and verify reference/root resolution.

Local verification: formatting, lint (ten generated warning), typecheck, boundary, 15 Bun test, brand coverage, 375 browser check and packed build pass. Repository coverage fails the unchanged 90% floor. Parent and child YAML both accepted by project 872 CI lint API. Linux visual baseline and mirrored Bun image are not locally proven. Generated/vendor formatter churn was removed and excluded from formatter ownership.
