# Console Prototype

**Proposal:** `console-prototype`
**Status:** done
**Phase:** [ADHD.md](../../ADHD.md) Foundation 2 — component catalog

## Problem

The catalog shows each component in isolation. Consumers cannot see how every component behaves when composed into a
real multi-page back-office with package defaults, and composition defects (overflow, overlay stacking, sidebar/header
interplay) only appear in consumer applications.

## Scope

### In scope

- Catalog family `prototype` with two full-screen, multi-page prototypes:
  - `default`: Bridge studio **Backstage Console** (dashboard, events, queue, musicians, releases, tickets, messages,
    content, onboarding, settings).
  - `admin`: generic **Admin Console** (overview, users, projects, billing, files, inbox, calendar, conference,
    workspace, help, settings).
- Each prototype independently composes every public component family (97) through `import * as UI from "@bridge/ui"`
  with DEFAULT settings: no appearance className/style override on package components.
- Static guard: each prototype uses at least one export of every catalog family; prototype source obeys the
  catalog-consumer-parity appearance rule.
- Browser contract: every prototype page renders without runtime error and without document overflow.

### Out of scope

- Package component change (fix only if a composition defect is found; then patch changeset).
- Routing library, data fetching, i18n.

## Success Criteria

- [x] `bun test test/internal` guard passes with 0 missing family per prototype.
- [x] Every page of both prototypes renders in Bun.WebView with no page error at 1440px and no overflow at 390px.
- [x] fmt, lint, typecheck, test, coverage, catalog:build, catalog:test pass.

## Specs

| Spec              | Path                             | Summary                                         |
| ----------------- | -------------------------------- | ----------------------------------------------- |
| console-prototype | `spec/console-prototype/spec.md` | Prototype coverage and default-setting contract |
