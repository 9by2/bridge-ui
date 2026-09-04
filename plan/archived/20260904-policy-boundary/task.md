# Task: Policy Boundary

Implementation order matters. Complete top to bottom.

## Setup

- [x] Inspect current agent guide, README, lint config, and local plan skill.
- [x] Confirm supported Oxlint rule from current documentation.

## Core

- [x] Add supported source restriction to `oxlint.config.ts`.
- [x] Move the north star, ideal architecture, and foundation contract to `ADHD.md`.
- [x] Reduce `README.md` to current project fact, command, and policy link.
- [x] Reduce `AGENTS.md` to agent workflow and reference.

## Verification

- [x] Run formatter.
- [x] Validate `oxlint.config.ts` with zero warning and zero error.
- [x] Validate generated Shadcn source is exempt from hand-authored boundary rules.
- [x] Validate representative existing consumer imports and type assertions are rejected.
- [x] Record full repository lint cleanup as Phase 1 scope; current baseline is 113 errors and one generated warning.
- [x] Review diff for duplicated or misplaced policy.
- [x] Review spec against implementation.
