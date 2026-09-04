# Policy Boundary

**Proposal:** `policy-boundary`
**Status:** done

## Problem

`AGENTS.md` currently mixes agent workflow, enforceable code rule, product architecture, package contract, migration plan, and external reference. This makes agent guidance too large and leaves machine-checkable rule unenforced.

## Scope

### In scope

- Keep agent-only workflow in `AGENTS.md`.
- Move ideal architecture and foundation contract to `ADHD.md`.
- Keep current project fact and command in `README.md`.
- Enforce supported import and TypeScript rule in `oxlint.config.ts`.
- Preserve generated Shadcn source exemption.

### Out of scope

- Implement Storybook, StyleX, package build, or consumer migration.
- Edit generated Shadcn component.
- Add custom Oxlint plugin for naming rule that Oxlint cannot express.

## Success Criteria

- [x] `AGENTS.md` contains agent workflow only.
- [x] `ADHD.md` documents the company-wide north star, architecture, foundation gate, and implementation sequence.
- [x] `README.md` documents current project fact, command, and policy link.
- [x] `oxlint.config.ts` enforces supported type assertion and import boundary rule.
- [x] Generated Shadcn source remain exempt from hand-authored source rule.
- [x] The lint configuration passes and rejects representative existing boundary violations.

Full repository lint compliance belongs to Phase 1 because the new policy intentionally exposes pre-existing source violations.

## Specs

| Spec            | Path                           | Summary                                                                 |
| --------------- | ------------------------------ | ----------------------------------------------------------------------- |
| policy-boundary | `spec/policy-boundary/spec.md` | Defines policy ownership between agent guide, ADHD, README, and Oxlint. |

## References

- `AGENTS.md`
- `ADHD.md`
- `README.md`
- `oxlint.config.ts`
- https://oxc.rs/docs/guide/usage/linter/rules/typescript/consistent-type-assertions
- https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-restricted-imports
