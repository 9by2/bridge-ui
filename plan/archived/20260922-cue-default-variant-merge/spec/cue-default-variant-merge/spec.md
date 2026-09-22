# Spec: Cue Default Variant Merge

**Spec ID:** `cue-default-variant-merge`
**Proposal:** `cue-default-variant-merge`
**Status:** accepted

## Summary

Bridge locally derives Cue defaults for selected components while retaining its public extension variants as additive behavior.

## Requirements

### REQ-001: Cue default derivation

Checkbox, Switch, Select, Tabs, and Badge defaults must reproduce applicable Cue root, state, interaction, and icon declarations in Cue mode. Skeleton retains its already-aligned Cue 2-second motion declaration.

### REQ-002: Extension retention

Existing Bridge-only variants and APIs remain supported. A Cue default correction must not remove or restyle an extension except where it inherits the corrected base recipe.

## Acceptance

- [ ] Browser contracts verify Cue defaults and extension availability.
- [ ] Public source contains no Cue runtime import.
