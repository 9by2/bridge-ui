# Tasks: Wizard Step

Implementation order matters — complete top to bottom.

## Setup

- [x] Create proposal, design, decision, and spec.

## Test

- [x] Add failing `test/component/wizard-step.test.tsx`: root native
      prop/ref/`data-orientation`/`data-variant`/`data-tone`, item
      `data-state` across all four states, indicator icon-by-state
      (completed=check, error=X, upcoming/current=children), connector
      `data-state`/`aria-hidden`, label/title/description/counter slot
      presence, `render` override producing a `<button>` for a completed
      item while `upcoming`/`current`/`error` remain `<div>`.
- [x] Add failing package-contract assertions in
      `test/internal/package-contract.test.ts` for `wizard-step` root +
      direct export (extend the `reusable presentation` test's name list).
- [x] Confirm `test/internal/catalog.test.ts` fails until
      `internal/catalog/example/wizard-step/default.tsx` exists (inventory
      is derived from `package.json` exports, so this fails once the
      export lands but before the example file exists).

## Core

- [x] Implement `app/component/brand/stylex/wizard-step.tsx`: `WizardStep`,
      `WizardStepItem` (`useRender`-based), `WizardStepIndicator`,
      `WizardStepConnector`, `WizardStepLabel`, `WizardStepTitle`,
      `WizardStepDescription`, `WizardStepCounter`. Reuse
      `token.primary`/`token.border`/`token.background`/
      `token.mutedForeground` formulas from `timeline-step.tsx`; add
      `token.destructive`/`token.destructiveForeground` for `error`.
- [x] Register root export in `app/index.ts`.
- [x] Register stable direct export `./wizard-step` in `package.json`
      `exports`.
- [x] Run test suite; confirm the failing tests from the Test phase now
      pass.

## Catalog

- [x] Add `internal/catalog/example/wizard-step/default.tsx` (horizontal
      3-step checkout wizard, `number` variant, one completed/current/
      upcoming step, matching the `TimelineStep` default example's shape).
- [x] Add `internal/catalog/example/wizard-step/states.tsx` covering:
      every `variant` (number/dot/line), `orientation`
      (horizontal/vertical), `tone` (hard/soft), every `state` including
      `error`, long copy, and Thai copy — mirroring
      `status-stamp/states.tsx` and `timeline-step`'s two-example
      structure.
- [x] Confirm `test/internal/catalog.test.ts` passes (inventory now
      matches).

## Integration

- [x] Add focused browser verification: dark theme, 390px mobile
      (contained horizontal overflow), reduced motion, and the `error`
      state rendering distinctly — extend
      `test/browser/dev-600-presentation-states.test.ts` or add a new
      `test/browser/wizard-step.test.ts` following its pattern.
- [x] Add a package Changeset (`bun changeset`) describing the new
      `WizardStep` reusable presentation family as a minor release.
- [x] Update `README.md` / component inventory reference if it lists
      reusable presentation families by name (check DEV-596 precedent).

## Verification

- [x] Run formatter (`bun fmt`), `bun lint`, `bun run typecheck`,
      `bun run boundary`, `bun test`, `bun run coverage:brand`,
      `bun run coverage:runtime`, catalog build (`bun catalog:build`) +
      `bun catalog:test`, package build (`bun run build`),
      `bun run verify:package`, `bun run verify:tree-shaking`.
- [x] Confirm 100% statement/branch/function/line coverage on
      `wizard-step.tsx` (non-Shadcn component gate).
- [x] Review every spec acceptance item in
      `spec/wizard-step/spec.md` against the implementation.
- [x] Archive proposal per `plan/PROPOSAL.md` /
      `.agents/skills/archive-plan/SKILL.md` and sync
      `spec/wizard-step/spec.md` to `plan/spec/wizard-step/spec.md`.
- [x] Commit directly on `main` with repository title format
      (`feat(wizard-step): add WizardStep reusable presentation family`).
