# Shared Theme Token

**Proposal:** `shared-theme-token`
**Status:** complete
**Phase:** [StyleX bundle](../../ADHD.md#3-stylex-bundle)

## Problem

Most owned recipes read private StyleX colors, typography and geometry directly. Button and Dialog additionally own separate CSS variables, preventing a single shared theme from styling all components.

## Scope

- Derive all owned recipe theme styling from semantic, stable CSS tokens.
- Keep the supported modes, variants and semantic component props.
- Remove component-specific CSS customization variables and document the common contract.

## Out of scope

- Generated Shadcn source and consumer migration.
- Engine-owned runtime variables (positioning, animation, chart data).

## Success Criteria

- [x] Published CSS lets a shared color/radius/typography override propagate across owned components.
- [x] No component-specific public styling variable remains in owned recipes.
- [x] Browser, package and coverage gates pass.

## Specs

| Spec               | Path                              | Summary                                   |
| ------------------ | --------------------------------- | ----------------------------------------- |
| shared-theme-token | `spec/shared-theme-token/spec.md` | Common styling contract for owned recipes |
