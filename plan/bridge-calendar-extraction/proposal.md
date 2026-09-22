# Bridge Calendar Extraction

**Proposal:** `bridge-calendar-extraction`
**Status:** in-progress
**Phase:** [Foundation-ready reusable presentation component](../../ADHD.md#foundation-first)

## Problem

Bridge Web owns a 13-file `BridgeCalendar` that provides scheduled, week, and month schedule views. Its reusable UI behavior is coupled to Bridge Web utilities, Thai i18n, responsive hooks, queue statuses, and schedule composition, so another application cannot consume the calendar without copying it.

## Scope

### In scope

- Extract the reusable, client-side schedule calendar into an owned StyleX component under `app/component/brand/stylex/`.
- Publish `BridgeCalendar` and its public types from `@bridge/ui/bridge-calendar` and the package root.
- Provide scheduled, week, and month views, navigation, event activation, slot selection, month drop intent, holidays, and scheduled-list pagination as UI-only behavior.
- Replace Bridge Web-only copy, icons, typography, utility classes, and responsive wrappers with package tokens and caller-supplied labels, slots, and render functions.
- Add public-contract tests, catalog examples, customization documentation, a minor Changeset, and required package verification evidence.
- Close reusable behavior gaps found by comparing the package contract with Bridge Web: overlap packing, all-day week events, localized period labels, accessible tabs, automatic pagination, initial timed-week position, dynamic month rows, and configurable week starts.

### Out of scope

- Bridge Web consumer migration or deletion of the current source.
- Querying holidays or events, queue-status mapping, event-proposal drag payloads, persistence, authorization, routing, or analytics.
- Product translations, product typography, and product-specific empty-state or event-card copy.
- Replacing the existing `Calendar` date-picker export at `@bridge/ui/calendar`.

## Success Criteria

- [ ] `BridgeCalendar` renders scheduled, week, and month views from consumer-provided events and holidays with no Bridge Web or i18n imports.
- [ ] Navigation, view changes, event activation, slot selection, month drop, and scheduled pagination emit documented UI intents without product side effects.
- [ ] Labels, action content, empty state, and event content are supplied through the public contract; the package ships no product copy.
- [ ] Direct package export, catalog, behavior coverage, accessibility, StyleX CSS extraction, packed client/SSR, tree-shaking, and Bun.WebView verification pass.
- [ ] Bridge Web’s reusable schedule behavior renders without event collisions or hard-coded product locale assumptions.

## Specs

| Spec            | Path                           | Summary                                               |
| --------------- | ------------------------------ | ----------------------------------------------------- |
| bridge-calendar | `spec/bridge-calendar/spec.md` | Public schedule-calendar API, behavior, and boundary. |

## References

- [ADHD.md](../../ADHD.md)
- `/Users/h/dev/@talent-tech/bridge-web/app/component/calendar/bridge/`
- `/Users/h/dev/@talent-tech/bridge-web/app/component/calendar/bridge/bridge-month-view.test.tsx`
