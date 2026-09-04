# Spec: Package Contract

**Spec ID:** `package-contract`
**Proposal:** `phase-2-package-foundation`
**Status:** accepted

## Summary

This spec defines the importable private `@bridge/ui` artifact consumed by Storybook and company applications.

## Requirements

### REQ-001: Generated compatibility

All generated components must form one compatible source snapshot.

**Acceptance:**

- [ ] Refresh is performed through the Shadcn CLI only.
- [ ] Full source typecheck passes.
- [ ] Generated inventory contains every pre-refresh component unless CLI removal is explicitly recorded.

### REQ-002: Public exports

Every public component must resolve from the package root.

**Acceptance:**

- [ ] `app/index.ts` exports every generated component module.
- [ ] Export inventory verification fails when a component file is omitted.
- [ ] No public declaration references repository-only paths.

### REQ-003: Build output

The package must emit ESM JavaScript, declarations, source maps, and CSS.

**Acceptance:**

- [ ] `dist/index.js` and source map exist.
- [ ] `dist/index.d.ts` and referenced declarations exist.
- [ ] `dist/style.css` exists.
- [ ] Build fails on JavaScript or declaration error.

### REQ-004: Manifest

The package manifest must expose stable consumer paths.

**Acceptance:**

- [ ] `@bridge/ui` resolves JavaScript and declarations.
- [ ] `@bridge/ui/style.css` resolves canonical CSS.
- [ ] Published files are allowlisted.
- [ ] CSS is declared as a side effect.
- [ ] React and React DOM are peer dependencies and external to build output.

### REQ-005: Packed artifact

The packed tarball must be the verified distribution unit.

**Acceptance:**

- [ ] `bun pm pack` succeeds after a clean build.
- [ ] Tarball contains package manifest and expected `dist` files only.
- [ ] Tarball contains no source, plan, test, fixture, or repository configuration.

### REQ-006: Consumer compatibility

Clean client and SSR consumers must install and build the tarball.

**Acceptance:**

- [ ] Fixture installation does not use workspace aliases.
- [ ] Fixture typecheck resolves root component types.
- [ ] Vite client build resolves JavaScript and CSS.
- [ ] Vite SSR build resolves JavaScript without browser-only import failure.
- [ ] React is not duplicated in fixture output.

## API

```tsx
import { Button, Dialog, Input } from "@bridge/ui"
import "@bridge/ui/style.css"
```

## Non-Goals

- Storybook configuration or stories.
- StyleX implementation.
- GitLab publication.
- Consumer application migration.
