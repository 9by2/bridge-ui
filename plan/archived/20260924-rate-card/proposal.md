# Rate card

**Proposal:** `rate-card`
**Status:** done
**Phase:** [ADHD.md](../../ADHD.md) — reusable presentation component

## Problem

`@bridge/web` hand-composes rate card UI from `div`, Badge and Button in `app/component/studio/rate-card/rate-card-list.tsx`. The package has no priced-offer presentation, so every consumer re-invents title, price, period, detail, feature and action layout.

Mobbin reference (web) shows three recurring use cases:

| Use case                       | Reference                                                               | Shape                                                             |
| ------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Manage rates (studio settings) | Squarespace pricing plans, Airbnb base price, bridge-web rate card list | Horizontal row: title + status, meta, price, edit/menu action     |
| Book or select a service       | Square service menu, Fresha, HoneyBook, Fiverr packages, Canva          | Card: title, description, duration, price, select/book action     |
| Compare plans or tiers         | Cursor, Webflow, Vercel, Zendesk, Upwork tiers                          | Column: highlight ribbon, large price + period, feature list, CTA |

## Scope

### In scope

- `RateCard` compound component with required `variants`: `row`, `card`, `plan`.
- Parts: header, title, description, price, detail list, feature list, highlight ribbon, content and action slot.
- Accessible name from title; semantic detail (`dl`) and feature (`ul`) list.
- Theme-aware tokens, direct and root export, catalog examples for every variant, documentation, changeset.

### Out of scope

- Currency formatting, selection state, business status, form/dialog/revision sheet, consumer migration.

## Success Criteria

- [x] Every variant is demonstrated in the catalog, including dark, Thai and long-copy states.
- [x] Public behavior tests pass; runtime coverage stays at or above 90%.
- [x] fmt, lint, typecheck, test, coverage, catalog build/test, package build and verification pass.
- [x] Bun.WebView evidence stored in `.eval/0924-rate-card/`.

## Specs

| Spec      | Path                     | Summary                           |
| --------- | ------------------------ | --------------------------------- |
| rate-card | `spec/rate-card/spec.md` | Public RateCard compound contract |

## References

- Mobbin: [Squarespace](https://mobbin.com/screens/b2a32cb5-744c-4358-ab83-ba9f6b98ce7e), [Square](https://mobbin.com/screens/cab81b77-26c9-41fc-b1f1-b6c12b67d35e), [Fresha](https://mobbin.com/screens/b9e60087-ff8a-4509-8bf9-98d21f089c7a), [Upwork](https://mobbin.com/screens/031b7410-09b3-41a4-802b-395075404792), [Cursor](https://mobbin.com/sites/sections/350dda44-322b-4e9c-ace3-1ce3adbf894a), [Webflow](https://mobbin.com/sites/sections/86a4762c-79ce-4fe5-8aa7-8bdbba561302), [Zendesk](https://mobbin.com/sites/sections/db55d7e4-744f-49b9-accb-7f9248ca938c)
