# North Star

> ADHD-friendly one-pager. If you only read one file before touching this repo, read this one.

## Goal

Build one stable, private, company-wide UI library.

Every company application should reuse the same accessible primitive, presentation component, token, theme foundation, test contract, and package release instead of copying UI source.

```text
@bridge/ui component -> application container -> application route/workflow
```

## One Source

`@bridge/ui` own:

- accessible primitive;
- reusable presentation component;
- canonical token and theme;
- UI-only hook and utility;
- Storybook catalog;
- component and package test;
- versioned private GitLab package.

Application own:

- container;
- data and business state;
- route and side effect;
- query, mutation, usecase, repository, and adapter;
- authorization;
- translated copy;
- DTO, mapper, and domain contract.

UI state may stay in a component. Business state must stay in an application container.

## Canonical Direction

- Cue is the current visual and component baseline.
- Bridge Web current theme is obsolete.
- Bridge Web is the first consumer migration.
- Cue is the second consumer migration.
- Future company application consume the same package contract.
- Product-specific page composition may differ. Primitive implementation must not fork.
- Product i18n never live in this package. Copy enter through prop or child.

## Source Boundary

```text
app/                # package source
  component/
    shadcn/         # generated; never manually edit
    global/         # reusable presentation component
  hook/
  lib/
  style/
  index.ts
shared/             # reusable non-component code
internal/           # non-exported tool and fixture
.storybook/
test/
```

Never add `src/` or production `container/`.

Public consumer import stable package export, never repository path:

```tsx
import { Button, Dialog, Field, Input } from "@bridge/ui"
import "@bridge/ui/style.css"
```

## Foundation First

Do not implement any consumer migration until all foundation gate pass.

### 1. Boundary

- zero `@cue/web` or `@bridge/web` import;
- zero product i18n import;
- zero container source;
- every public module satisfy package ownership.

### 2. Shadcn Storybook

- every generated Shadcn component has a story;
- every interactive component has an interaction story;
- relevant disabled, invalid, loading, open, empty, long-copy, Thai-copy, dark, mobile, and reduced-motion state exist;
- accessibility, visual, inventory, and static Storybook check pass.

### 3. StyleX Bundle

- Storybook and Bun build compile through StyleX;
- production CSS extract statically;
- canonical token support light and dark mode;
- clean Vite client and SSR fixture build pass;
- published package need no undocumented consumer transform;
- CSS load once and React is not duplicated.

### 4. Private Package

- ESM, declaration, source map, and final CSS output exist;
- root and stable subpath export resolve;
- packed tarball install pass;
- private GitLab publish and install pass with current Bun;
- prerelease prove integration before `latest`.

### 5. Quality

- repository coverage is at least 90%;
- every non-Shadcn component has 100% statement, branch, function, and line coverage;
- lint, typecheck, test, Storybook, visual, package, client, and SSR build pass.

## Build Order

1. Delete copied container, domain component, Cue i18n, and consumer import.
2. Build stable package export, declaration, CSS, and fixture.
3. Add Storybook for every Shadcn component.
4. Integrate StyleX and prove static package output.
5. Publish and install a private GitLab prerelease.
6. Pass every foundation gate.
7. Migrate Bridge Web one primitive family at a time; delete each local duplicate immediately.
8. Stabilize the package.
9. Migrate Cue.
10. Require every future company application to consume `@bridge/ui`.

## Current Reality

Foundation is not ready.

At this document revision:

- 63 generated Shadcn component file;
- 63 real Shadcn stories with exact inventory coverage;
- 27 named variant galleries cover every explicit finite generated `variant`, `size`, `orientation`, `side`, `align`, `state`, and `collapsible` value at least once;
- all 90 default and variant stories pass headless Chromium and accessibility checks;
- required button, input, checkbox, select, dialog, popover, tabs, accordion, tooltip, and toast interactions pass;
- Storybook development smoke test and static build pass;
- zero StyleX integration;
- ESM package, declaration, source map, CSS export, tarball, client fixture, and SSR fixture pass;
- copied application component and consumer import removed;
- source-boundary check, package build, full typecheck, and test pass;
- Shadcn source refreshed through CLI 4.21.0; `multi-select` is preserved because it is unavailable in the current registry;
- generated source has 10 lint warnings and zero lint errors.

Do not weaken the gate to make the current snapshot pass. Fix the foundation.

## Source of Truth

- This file: ideal architecture, sequence, and release gate.
- [README.md](./README.md): current project fact, command, and document link.
- [oxlint.config.ts](./oxlint.config.ts): machine-enforced source restriction.
- [AGENTS.md](./AGENTS.md): agent execution workflow only.
- `plan/`: active implementation decision and accepted spec.

## Reference

- [Consolidation decision](https://artifact.9by2.workers.dev/artifact/01a06bd6-c1ff-7dae-97c1-c143fd598b8e/)
- [StyleX](https://stylexjs.com/)
- [Storybook](https://storybook.js.org/docs)
- [GitLab npm registry](https://docs.gitlab.com/user/packages/npm_registry/)
- [Bun package manager](https://bun.com/docs/pm)
