# Tasks: Phase 1 Clean Boundary

Implementation order matters. Complete top to bottom.

## Setup

- [ ] Record the exact baseline: source file count, forbidden import count, dependency count, lint result, typecheck result, and generated Shadcn tree hash.
- [ ] Create `inventory.md` with one row for every module under `app/`, including current responsibility, forbidden dependency, disposition, and rationale.
- [ ] Classify every module as keep unchanged, retain and decouple, move to `shared/`, move to private preview support, or delete.
- [ ] Review every retain decision against the component boundary in `ADHD.md` before production edits.

## Boundary Test

- [ ] Add a failing automated check that detects `@cue/web` and `@bridge/web` imports in package source.
- [ ] Add a failing automated check that detects product i18n, router, mapper, DTO, repository, usecase, authorization, and known application-only dependency in package source.
- [ ] Add a failing automated check that detects private `@bridge/ui/app/**` imports in hand-authored source while excluding generated Shadcn source.
- [ ] Add a fixture proving each forbidden pattern causes the boundary check to fail.

## Remove Application Source

- [ ] Delete `app/component/studio/` after inventory review.
- [ ] Delete `app/component/ticket/` after inventory review.
- [ ] Delete route-bound and product-workflow global components identified by the inventory.
- [ ] Delete product-specific utility and contract copied into package source.
- [ ] Confirm no production container directory or container behavior remains.

## Retain Reusable UI

- [ ] For each retained non-Shadcn component, write a failing behavior test before changing its contract.
- [ ] Replace product translation lookup with required or optional copy props and children.
- [ ] Replace route behavior with renderable child, URL, or callback only when the resulting contract is reusable; otherwise delete the component.
- [ ] Replace consumer DTO, mapper, status, date, financial, social, or PromptPay dependency only when generic UI logic remains; otherwise delete the component.
- [ ] Move reusable non-component logic to `shared/` and test its public behavior.
- [ ] Remove type assertions from retained hand-authored source.
- [ ] Replace `@bridge/ui/app/**` imports in retained hand-authored source with local imports.

## Dependency Cleanup

- [ ] Re-scan all imports after source cleanup.
- [ ] Remove runtime dependency used only by deleted application source.
- [ ] Move build-only and test-only dependency to `devDependencies` where appropriate.
- [ ] Keep React dependency policy unchanged for Phase 2 to finalize with the package export contract.
- [ ] Run `bun install` and review the lockfile change.

## Integration

- [ ] Make the automated boundary check part of a Bun script used by local and CI verification.
- [ ] Run the current preview only if preview source remains; remove obsolete preview entry instead of restoring application coupling.
- [ ] Re-run the complete inventory and confirm every surviving module has package ownership.
- [ ] Confirm generated Shadcn source hash matches the baseline.

## Verification

- [ ] Run formatter.
- [ ] Run automated boundary check, including forbidden fixtures.
- [ ] Run `bun lint`; allow only the existing generated `chart.tsx` warning unless a CLI refresh removes it.
- [ ] Run TypeScript typecheck.
- [ ] Run all relevant unit and integration test.
- [ ] Confirm zero `@cue/web`, `@bridge/web`, product-i18n, router, mapper, DTO, repository, usecase, and authorization import in package source.
- [ ] Confirm zero private `@bridge/ui/app/**` import in hand-authored source.
- [ ] Confirm `app/component/studio/`, `app/component/ticket/`, `src/`, and production container source do not exist.
- [ ] Review final dependency list for consumer application package.
- [ ] Review `spec/source-boundary/spec.md` against implementation.
- [ ] Mark proposal done and archive it before creating the Phase 2 package-build proposal.
