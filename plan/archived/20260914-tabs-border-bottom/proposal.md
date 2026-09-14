# Tabs Border Bottom

**Proposal:** `tabs-border-bottom`
**Status:** done
**Phase:** [ADHD component catalog](../../ADHD.md#2-shadcn-component-catalog)

## Problem

Tabs supports filled and active-line treatments but lacks a full-width bottom-border navigation treatment.

## Scope

### In scope

- Add `border-bottom` to `TabsList` and `tabsListVariants`.
- Show the variant in the catalog.
- Cover its public helper and DOM contract.

### Out of scope

- Generated Shadcn source.
- Tabs behavior or keyboard changes.

## Success Criteria

- [x] `TabsList variant="border-bottom"` renders a list rule and active underline.
- [x] Existing variant remains unchanged.
- [x] Component test and focused catalog verification pass.

## Specs

| Spec         | Path                        | Summary                            |
| ------------ | --------------------------- | ---------------------------------- |
| tabs-variant | `spec/tabs-variant/spec.md` | Public Tabs list variant contract. |

## References

- [ADHD.md](../../ADHD.md)
