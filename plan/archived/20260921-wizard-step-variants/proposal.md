# Wizard Step Variants

**Proposal:** `wizard-step-variants`
**Status:** done
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

WizardStep does not provide the labeled tracker and segmented bar presentations required by the supplied references. Its declared `line` variant has no rendered behavior.

## Scope

### In scope

- Add root-coordinated labeled tracker and segmented bar WizardStep variants.
- Retain the existing compound component API and accessibility metadata.
- Document the variants in the catalog and protect public behavior with tests.

### Out of scope

- Product workflow state or localized copy.
- Consumer application migration.

## Success Criteria

- [x] Number variant renders labels beneath centered circular indicators in horizontal orientation.
- [x] Line variant renders each step as a labeled progress segment without visible connectors.
- [x] Existing WizardStep variants and all verification gates remain valid.

## Specs

| Spec                 | Path                                | Summary                                         |
| -------------------- | ----------------------------------- | ----------------------------------------------- |
| wizard-step-variants | `spec/wizard-step-variants/spec.md` | Compound API behavior for coordinated variants. |

## References

- Supplied labeled tracker and segmented progress references.
- [ADHD.md](../../ADHD.md)
