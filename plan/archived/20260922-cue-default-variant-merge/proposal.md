# Cue Default Variant Merge

**Proposal:** `cue-default-variant-merge`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

The Cue derivation audit found default-recipe drift in core controls and navigation/status components. Bridge also owns public extensions that must not be replaced by Cue source.

## Scope

### In scope

- Derive the Cue default recipe for Checkbox, Switch, Select, Tabs, and Badge in local StyleX. Skeleton already matches Cue's 2-second `animate-pulse` cycle.
- Merge Cue declarations into existing Bridge variants without deleting Bridge-only variants or APIs.
- Add Cue-mode rendered regression coverage for default recipes and extension preservation.

### Out of scope

- Importing Cue runtime, Tailwind output, product code, or consumer migration.
- Removing Bridge variants including Tabs `capsule` and Badge `success` / `partial-success`.
- Complex-overlay parity work identified as a separate audit slice.

## Success Criteria

- [ ] Cue default declarations resolve in each affected public component.
- [ ] Existing Bridge extensions remain available and behaviorally intact.
- [ ] Cue browser contracts cover default and merged-variant behavior.

## Specs

| Spec                      | Path                                     | Summary                                           |
| ------------------------- | ---------------------------------------- | ------------------------------------------------- |
| cue-default-variant-merge | `spec/cue-default-variant-merge/spec.md` | Default derivation with additive Bridge variants. |
