# Tasks: Phase 2 Package Foundation

Implementation order matters. Complete top to bottom.

## Setup

- [ ] Record current Shadcn file list, hash, CLI version, full typecheck errors, and package manifest.
- [ ] Add failing export-inventory and packed-package contract tests.
- [ ] Inspect Shadcn CLI dry-run/diff for all existing components.

## Generated Compatibility

- [ ] Refresh all existing Shadcn components through the CLI with Bun.
- [ ] Record generated diff and new hash.
- [ ] Run full typecheck and resolve only configuration/dependency issues outside generated source.
- [ ] Verify generated file inventory remains complete.

## Public Package

- [ ] Create `app/index.ts` root exports.
- [ ] Add automatic export inventory verification.
- [ ] Configure React and React DOM as peer dependencies.
- [ ] Define package files, exports, types, module, and CSS side effects.
- [ ] Add Bun ESM build with external runtime dependencies and source maps.
- [ ] Add declaration-only TypeScript emit.
- [ ] Copy canonical CSS to stable `dist/style.css`.

## Packed Verification

- [ ] Build and pack the package.
- [ ] Assert tarball contains only allowed files.
- [ ] Install tarball in isolated client fixture.
- [ ] Typecheck and build Vite client fixture.
- [ ] Install tarball in isolated SSR fixture.
- [ ] Typecheck and build Vite SSR fixture.
- [ ] Verify JavaScript, declaration, and CSS exports resolve.
- [ ] Verify React is not bundled or duplicated.

## Verification

- [ ] Run formatter, boundary check, lint, full typecheck, and test.
- [ ] Run package build twice and verify deterministic output paths.
- [ ] Run packed client and SSR verification from clean temp directories.
- [ ] Update README and ADHD current reality.
- [ ] Review spec against implementation.
- [ ] Archive proposal and sync accepted spec.
