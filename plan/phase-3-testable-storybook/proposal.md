# Phase 3: Testable Storybook

**Proposal:** `phase-3-testable-storybook`
**Status:** draft
**Phase:** [ADHD Build Order 3](../../ADHD.md#build-order)

## Problem

The package is importable but has no visual catalog or browser-executed component contract. All 63 generated modules need discoverable stories, and interactive primitives need executable interactions before consumer migration.

## Scope

### In scope

- Storybook 10 React-Vite setup using the package root contract.
- One story file for every generated Shadcn module.
- Autodocs, theme, viewport, dark mode, reduced motion, English, and Thai fixtures.
- Interaction stories for representative interactive primitive families.
- Story inventory enforcement.
- Accessibility addon, static build, and headless Chromium story tests.

### Out of scope

- StyleX integration.
- GitLab publication.
- Visual-regression service integration.
- Consumer migration.

## Success Criteria

- [ ] Every generated Shadcn module has a matching story file.
- [ ] Story inventory test fails on a missing module story.
- [ ] Storybook development server starts.
- [ ] Static Storybook build passes.
- [ ] Browser story tests execute in headless Chromium.
- [ ] Button, input, checkbox, dialog, select, tabs, accordion, popover, tooltip, and toast families have interaction coverage.
- [ ] Accessibility checks run through Storybook.
- [ ] Light, dark, mobile, reduced-motion, English, and Thai fixtures are available.

## Specs

| Spec               | Path                              | Summary                                                                        |
| ------------------ | --------------------------------- | ------------------------------------------------------------------------------ |
| storybook-contract | `spec/storybook-contract/spec.md` | Defines story inventory, fixtures, interactions, build, and browser execution. |

## References

- [North star](../../ADHD.md)
- [Package contract](../spec/package-contract/spec.md)
- [Storybook documentation](https://storybook.js.org/docs)
