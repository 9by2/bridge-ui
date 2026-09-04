# Phase 1: Clean Boundary

**Proposal:** `phase-1-clean-boundary`
**Status:** draft
**Phase:** [ADHD Build Order 1](../../ADHD.md#build-order)

## Problem

The repository is a source copy, not yet an independent company UI library. Hand-authored components import Cue application contracts, product i18n, routing, and domain-specific libraries. Product folders live beside reusable primitives, private package paths are used as internal aliases, and `bun lint` currently reports 113 errors.

Until this boundary is clean, later package, Storybook, StyleX, and registry work would stabilize the wrong source ownership.

## Scope

### In scope

- Inventory every module under `app/` and classify it as reusable UI, application-owned, generated Shadcn, or private preview support.
- Remove application-owned `studio/`, `ticket/`, route, domain, DTO, mapper, authorization, and workflow source from this repository.
- Remove every `@cue/web` and `@bridge/web` dependency from package source.
- Remove package-owned product i18n; reusable visible copy becomes a prop or child.
- Retain and decouple only components that satisfy the ownership contract in `ADHD.md`.
- Move reusable non-component logic to `shared/` when needed by retained components.
- Replace private `@bridge/ui/app/**` imports in hand-authored source with valid local imports.
- Add automated source-boundary verification.
- Remove dependencies that become unused after cleanup.

### Out of scope

- Editing generated files under `app/component/shadcn/`.
- Creating the public `app/index.ts` package contract.
- Replacing the preview build with a library build.
- Adding Storybook stories.
- Integrating StyleX.
- Publishing to GitLab.
- Modifying Bridge Web or Cue.

## Success Criteria

- [ ] Every `app/` module has an explicit ownership disposition recorded during implementation.
- [ ] `app/component/studio/` and `app/component/ticket/` no longer exist.
- [ ] Package source has zero `@cue/web` and zero `@bridge/web` imports.
- [ ] Package source has zero application router, mapper, DTO, authorization, repository, usecase, or product-i18n dependency.
- [ ] Every retained non-Shadcn component accepts visible product copy through prop or child.
- [ ] Every retained non-Shadcn component satisfies the component boundary in `ADHD.md`.
- [ ] Hand-authored source has zero private `@bridge/ui/app/**` imports.
- [ ] Generated Shadcn source is unchanged.
- [ ] Automated boundary verification fails on a representative forbidden import fixture.
- [ ] `bun lint` passes except any pre-existing warning in generated Shadcn source.
- [ ] Typecheck and relevant test pass.
- [ ] Phase 2 remains blocked until this proposal is complete and archived.

## Specs

| Spec            | Path                           | Summary                                                                                              |
| --------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| source-boundary | `spec/source-boundary/spec.md` | Defines allowed package ownership, dependencies, imports, and verification for hand-authored source. |

## References

- [North star](../../ADHD.md)
- [Current project facts](../../README.md)
- [Enforced lint rules](../../oxlint.config.ts)
- [Consolidation decision](https://artifact.9by2.workers.dev/artifact/01a06bd6-c1ff-7dae-97c1-c143fd598b8e/)
