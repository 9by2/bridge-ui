# Cue Theme Alignment

**Proposal:** `cue-theme-alignment`
**Status:** in-progress
**Phase:** [ADHD foundation first](../../ADHD.md#foundation-first)

## Problem

The public StyleX implementation matches the prior Bridge baseline but does not expose Cue's complete semantic color, action, status, typography, surface, or native browser theme contract.

## Scope

### In scope

- Add an explicit Cue theme mode and missing semantic token.
- Align Button, Badge, title typography, surface, sidebar, native control, scrollbar, and toast state.
- Add catalog and public-seam verification.
- Produce Bun.WebView evaluation evidence and run the required foundation command.

### Out of scope

- Cue application migration.
- Product business state or status vocabulary beyond reusable presentation semantic.
- Generated Shadcn source edit.

## Success Criteria

- [ ] Cue semantic color and native style match Cue runtime source.
- [ ] CTA, warning, destructive action, and status Badge render through public API.
- [ ] Cue mode survives portal rendering and stays distinct from generic light/dark mode.
- [ ] Catalog, package, accessibility, test, coverage, and build gate pass.

## Specs

| Spec                 | Path                              | Summary                                                                        |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| `cue-theme-contract` | `spec/cue-theme-contract/spec.md` | Public Cue mode, semantic token, component variant, and verification contract. |

## References

- [ADHD.md](../../ADHD.md)
- Cue `DESIGN.md` and runtime `app/globals.css` at `778ae4b4d85e011639dc4f33f061c5ea20913f63`
- Theme audit artifact `01a09f41-5d90-7ae6-ad0b-29061d086e14`
