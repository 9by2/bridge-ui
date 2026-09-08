# @bridge/ui

## 0.1.1-rc.1

### Patch Changes

- 7150c06: Emit production-compatible JSX so package component renders with production React. Execute packed SSR output during release verification instead of checking compilation alone.

## 0.1.1-rc.0

### Patch Changes

- b1c984e: Automate reviewed Changesets release MR publication for RC and stable version on protected main, with isolated registry verification and post-publication Git tag creation.

## 0.1.0

### Minor Changes

- Separate package runtime coverage from command and catalog verification. Retain the 90% runtime floor and 100% brand floor, add mobile hook lifecycle verification, and keep command, packed package and browser verification mandatory in CI.
