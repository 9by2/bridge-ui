# Tasks: Phase 1 Clean Boundary

Implementation order matters. Complete top to bottom.

## Setup

- [x] Record the exact baseline: source file count, forbidden import count, dependency count, lint result, typecheck result, and generated Shadcn tree hash.
- [x] Create `inventory.md` with one row for every module under `app/`, including current responsibility, forbidden dependency, disposition, and rationale.
- [x] Classify every module as keep unchanged, retain and decouple, move to `shared/`, move to private preview support, or delete.
- [x] Review every retain decision against the component boundary in `ADHD.md` before production edits.

## Boundary Test

- [x] Add a failing automated check that detects `@cue/web` and `@bridge/web` imports in package source.
- [x] Add a failing automated check that detects product i18n, router, mapper, DTO, repository, usecase, authorization, and known application-only dependency in package source.
- [x] Add a failing automated check that detects private `@bridge/ui/app/**` imports in hand-authored source while excluding generated Shadcn source.
- [x] Add a fixture proving each forbidden pattern causes the boundary check to fail.

## Remove Application Source

- [x] Delete `app/component/studio/` after inventory review.
- [x] Delete `app/component/ticket/` after inventory review.
- [x] Delete route-bound and product-workflow global components identified by the inventory.
- [x] Delete product-specific utility and contract copied into package source.
- [x] Confirm no production container directory or container behavior remains.

## Retain Reusable UI

- [x] Confirm no non-Shadcn component is retained without an approved reusable contract; no component behavior test is required in this phase.
- [x] Remove product translation lookup by deleting its application-owned component.
- [x] Delete route behavior because no reusable route-independent contract is approved.
- [x] Delete consumer DTO, mapper, status, date, financial, social, and PromptPay coupling because no generic UI contract remains.
- [x] Confirm no reusable non-component logic needs to move to `shared/`.
- [x] Confirm retained hand-authored source contains no type assertion.
- [x] Confirm retained hand-authored source contains no `@bridge/ui/app/**` import.

## Dependency Cleanup

- [x] Re-scan all imports after source cleanup.
- [x] Remove runtime dependency used only by deleted application source.
- [x] Move build-only and test-only dependency to `devDependencies` where appropriate.
- [x] Keep React dependency policy unchanged for Phase 2 to finalize with the package export contract.
- [x] Run `bun install` and review the lockfile change.

## Integration

- [x] Make the automated boundary check part of a Bun script used by local and CI verification.
- [x] Remove obsolete preview source and scripts instead of restoring application coupling.
- [x] Re-run the complete inventory and confirm every surviving module has package ownership.
- [x] Confirm generated Shadcn source hash matches the baseline.

## Verification

- [x] Run formatter.
- [x] Run automated boundary check, including forbidden fixtures.
- [x] Run `bun lint`; allow only the existing generated `chart.tsx` warning unless a CLI refresh removes it.
- [x] Run Phase 1 TypeScript typecheck; record full generated compatibility debt separately.
- [x] Run all relevant unit and integration test.
- [x] Confirm zero `@cue/web`, `@bridge/web`, product-i18n, router, mapper, DTO, repository, usecase, and authorization import in package source.
- [x] Confirm zero private `@bridge/ui/app/**` import in hand-authored source.
- [x] Confirm `app/component/studio/`, `app/component/ticket/`, `src/`, and production container source do not exist.
- [x] Review final dependency list for consumer application package.
- [x] Review `spec/source-boundary/spec.md` against implementation.
- [x] Mark proposal done and archive it before creating the Phase 2 package-build proposal.
