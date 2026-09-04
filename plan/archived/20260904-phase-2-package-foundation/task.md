# Tasks: Phase 2 Package Foundation

Implementation order matters. Complete top to bottom.

## Setup

- [x] Record current Shadcn file list, hash, CLI version, full typecheck errors, and package manifest.
- [x] Add failing export-inventory and packed-package contract tests.
- [x] Inspect Shadcn CLI dry-run/diff for all existing components.

## Generated Compatibility

- [x] Refresh all registry-backed Shadcn components through CLI 4.21.0 with Bun; preserve unavailable `multi-select` unchanged.
- [x] Record generated diff and new hash `6fe0dfa8de5ba4d067c3573bc061fe9c7ae8676c0e60b492930c3225269b319b`.
- [x] Run full typecheck and resolve only configuration/dependency issues outside generated source.
- [x] Verify generated file inventory remains complete at 63 modules.

## Public Package

- [x] Create `app/index.ts` root exports.
- [x] Add automatic export inventory verification.
- [x] Configure React and React DOM as peer dependencies.
- [x] Define package files, exports, types, module, and CSS side effects.
- [x] Add Bun ESM build with external runtime dependencies and source maps.
- [x] Add declaration-only TypeScript emit.
- [x] Copy canonical CSS to stable `dist/style.css` with a TypeScript declaration.

## Packed Verification

- [x] Build and pack the package.
- [x] Assert tarball contains only allowed files.
- [x] Install tarball in isolated client fixture.
- [x] Typecheck and build Vite client fixture.
- [x] Install tarball in isolated SSR fixture.
- [x] Typecheck and build Vite SSR fixture.
- [x] Verify JavaScript, declaration, and CSS exports resolve.
- [x] Verify React is not bundled or duplicated.

## Verification

- [x] Run formatter, boundary check, lint, full typecheck, and test.
- [x] Run package build twice and verify deterministic output hashes.
- [x] Run packed client and SSR verification from clean temp directories.
- [x] Update README and ADHD current reality.
- [x] Review spec against implementation.
- [x] Archive proposal and sync accepted spec.
