# Browser Test Composition

**Proposal:** `browser-test-composition`
**Status:** done
**Phase:** [ADHD quality](../../ADHD.md#5-quality)

## Problem

The mandatory catalog pre-push gate takes nearly ten minutes. Its 389 serial per-example WebView and axe cases repeat equivalent semantic, visual, and token evidence while permanent migration and CSS-detail tests multiply the same claims across themes and viewports.

## Scope

### In scope

- Validate every catalog example through static inventory and Vite compilation.
- Retain owned behavior at component-test seams.
- Replace exhaustive browser fixture checks with compact risk-selected browser contracts.
- Separate visual and memory diagnostics from the pre-push browser command.
- Remove completed migration parity and redundant concrete browser assertions.

### Out of scope

- Changing public component APIs or catalog examples.
- Reducing runtime coverage requirements.
- Moving complete browser verification back to CI.

## Success Criteria

- [x] Every catalog example remains statically discovered and built.
- [x] Pre-push `bun catalog:test` runs the compact browser contract suite only.
- [x] Visual and memory diagnostics are independently runnable.
- [x] Browser assertions identify browser-only public contracts or focused regressions.
- [x] Documentation and canonical specs define the four-layer model.

## Specs

| Spec                     | Path                                    | Summary                                                          |
| ------------------------ | --------------------------------------- | ---------------------------------------------------------------- |
| browser-test-composition | `spec/browser-test-composition/spec.md` | Defines inventory, component, browser, and diagnostic ownership. |

## References

- [ADHD.md](../../ADHD.md)
- [Catalog contract](../spec/catalog-contract/spec.md)
- [Browser test composition review](https://artifact.9by2.workers.dev/artifact/01a0c949-b93f-7e39-94cb-582562f05a84/)
