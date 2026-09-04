# Phase 2: Package Foundation

**Proposal:** `phase-2-package-foundation`
**Status:** draft
**Phase:** [ADHD Build Order 2](../../ADHD.md#build-order)

## Problem

The source boundary is clean, but `@bridge/ui` is not importable. It has no public entry, exports map, declaration output, CSS package export, package build, tarball validation, or clean consumer fixture. Generated Shadcn modules also contain compatibility errors caused by a mixed generated snapshot.

Storybook must consume the same package-ready source contract that applications will use, so package compatibility must be established first.

## Scope

### In scope

- Refresh existing generated Shadcn source through the Shadcn CLI to one compatible snapshot.
- Make every generated component typecheck without manual generated-source edits.
- Create a stable root public entry for all generated components.
- Build ESM JavaScript with Bun and declarations with TypeScript.
- Export canonical CSS.
- Externalize React and runtime dependencies from the library bundle.
- Pack a tarball and install it into clean client and SSR fixtures.
- Verify public JavaScript, type, CSS, and React singleton behavior.

### Out of scope

- Storybook setup and stories.
- StyleX integration and extraction.
- GitLab publication.
- Consumer application migration.
- New composed non-Shadcn component.

## Success Criteria

- [ ] Generated source is refreshed only through the Shadcn CLI.
- [ ] Full package typecheck passes.
- [ ] Every generated Shadcn module is reachable from `@bridge/ui`.
- [ ] `bun build` emits ESM JavaScript and source maps.
- [ ] TypeScript emits declarations for every public export.
- [ ] `@bridge/ui/style.css` resolves from the package export map.
- [ ] React and React DOM are peer dependencies and not bundled.
- [ ] `bun pm pack` contains only publishable package files.
- [ ] Clean client and SSR fixtures install the tarball without repository alias.
- [ ] Fixture typecheck and builds pass.
- [ ] Phase 3 Storybook can import components from the root package contract.

## Specs

| Spec             | Path                            | Summary                                                                                      |
| ---------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| package-contract | `spec/package-contract/spec.md` | Defines public exports, build output, peer dependencies, tarball, and consumer verification. |

## References

- [North star](../../ADHD.md)
- [Source boundary spec](../spec/source-boundary/spec.md)
- [Bun bundler](https://bun.com/docs/bundler)
- [Shadcn CLI](https://ui.shadcn.com/docs/cli)
