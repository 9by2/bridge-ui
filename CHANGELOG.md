# @bridge/ui

## 0.1.1-rc.0

### Patch Changes

- b1c984e: Automate reviewed Changesets release MR publication for RC and stable version on protected main, with isolated registry verification and post-publication Git tag creation.

## 0.1.0

### Minor Changes

- Separate package runtime coverage from command and catalog verification. Retain the 90% runtime floor and 100% brand floor, add mobile hook lifecycle verification, and keep command, packed package and browser verification mandatory in CI.
