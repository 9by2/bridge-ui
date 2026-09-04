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

- [x] Refresh is performed through Shadcn CLI 4.21.0 only; unavailable `multi-select` remains unchanged.
- [x] Full source typecheck passes.
- [x] Generated inventory contains all 63 pre-refresh components.

### REQ-002: Public exports

Every public component must resolve from the package root.

**Acceptance:**

- [x] `app/index.ts` exports every generated component module.
- [x] Export inventory verification fails when a component file is omitted.
- [x] No public declaration references repository-only paths.

### REQ-003: Build output

The package must emit ESM JavaScript, declarations, source maps, and CSS.

**Acceptance:**

- [x] `dist/index.js` and source map exist.
- [x] `dist/index.d.ts` and referenced declarations exist.
- [x] `dist/style.css` exists.
- [x] `dist/style.css.d.ts` exists for TypeScript side-effect import resolution.
- [x] Build fails on JavaScript or declaration error.

### REQ-004: Manifest

The package manifest must expose stable consumer paths.

**Acceptance:**

- [x] `@bridge/ui` resolves JavaScript and declarations.
- [x] `@bridge/ui/style.css` resolves canonical CSS.
- [x] Published files are allowlisted.
- [x] CSS is declared as a side effect.
- [x] React and React DOM are peer dependencies and external to build output.

### REQ-005: Packed artifact

The packed tarball must be the verified distribution unit.

**Acceptance:**

- [x] `bun pm pack` succeeds after a clean build.
- [x] Tarball contains package manifest, README, and expected `dist` files only.
- [x] Tarball contains no source, plan, test, fixture, or repository configuration.

### REQ-006: Consumer compatibility

Clean client and SSR consumers must install and build the tarball.

**Acceptance:**

- [x] Fixture installation does not use workspace aliases.
- [x] Fixture typecheck resolves root component types.
- [x] Vite client build resolves JavaScript and CSS.
- [x] Vite SSR build resolves JavaScript without browser-only import failure.
- [x] React is not duplicated in fixture output.

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
