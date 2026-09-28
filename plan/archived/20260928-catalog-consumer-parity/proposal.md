# Catalog Consumer Parity

**Proposal:** `catalog-consumer-parity`
**Status:** done
**Phase:** [ADHD Foundation 2 — catalog](../../ADHD.md)

## Problem

Sidebar and menu examples look polished in the catalog but different in bridge-web with the same exported components.

Root cause: `internal/catalog/index.html` declares `@layer theme, base, components, priority1..9, utilities`. Tailwind utilities therefore win over package StyleX (`priority1..9`) in the catalog only. A consumer imports Tailwind before `@bridge/ui/style.css`, so its order is `theme, base, components, utilities, priority1..9` (measured in bridge-web dev) and the same example className loses. Example classes such as `SidebarHeader className="p-4"` rendered 16px in the catalog but 8px in every consumer.

A layer-order A/B audit of all 421 examples found 63 examples whose computed geometry or typography depended on this catalog-only precedence.

## Scope

### In scope

- Catalog cascade uses the consumer layer order.
- Every affected example either uses a package prop/variant/level or moves layout to a clearly named example wrapper element.
- Package variant only where an example proves a reusable consumer need.
- Sidebar edge spacing stays at the Shadcn/package default, expressed through rem global spacing tokens.
- Regression coverage: static guard against component-styling className in examples; browser parity between catalog example and an independent consumer-order fixture for sidebar and menu.

### Out of scope

- bridge-web code change (consumer migration is never implemented here).
- Generated `app/component/shadcn/` source.
- Changing bridge-web Theme radius override.

## Success Criteria

- [x] Catalog layer order equals consumer order.
- [x] Zero example className on a package component sets padding, gap, typography, border, radius, color, or shadow that the component owns.
- [x] Sidebar/menu slot computed styles match between catalog example and consumer fixture at desktop and mobile, with short to paragraph-length labels and no document overflow.
- [x] fmt, lint, typecheck, test, coverage, build, catalog build, catalog browser contract, package verification pass.

## Specs

| Spec                    | Path                                   | Summary                                      |
| ----------------------- | -------------------------------------- | -------------------------------------------- |
| catalog-consumer-parity | `spec/catalog-consumer-parity/spec.md` | Catalog cascade and example styling contract |

## References

- `.eval/0928-sidebar-menu-parity/`
