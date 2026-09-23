# Brand Color Variable

**Proposal:** `brand-color-variable`
**Status:** done
**Phase:** [StyleX bundle](../../ADHD.md#3-stylex-bundle)

## Problem

Brand recipes currently depend on generated StyleX variable names, preventing a host CSS hotfix.

## Scope

- Expose stable brand color CSS names through the published stylesheet and recipes.
- Preserve existing mode defaults and foreground contrast pairs.
- Document the host override contract and verify the packed CSS.

## Out of scope

- Consumer migration or palette redesign.

## Success Criteria

- [x] Brand recipes use stable `--bridge-color-brand*` overrides with mode-specific fallbacks.
- [x] Packed CSS retains the public names.

## Specs

| Spec                 | Path                                | Summary                   |
| -------------------- | ----------------------------------- | ------------------------- |
| brand-color-variable | `spec/brand-color-variable/spec.md` | Stable CSS override names |
