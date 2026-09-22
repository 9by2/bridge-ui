# Spec: Bridge Calendar

**Spec ID:** `bridge-calendar`
**Proposal:** `bridge-calendar-extraction`
**Status:** accepted

## Summary

This spec defines `BridgeCalendar`, a package-owned, client-side multi-view schedule calendar. It renders generic event and holiday data in scheduled, week, and month views and reports UI intent through callbacks. It does not own product data, copy, or side effects.

## Requirements

### REQ-001: Package boundary

The implementation lives under `app/component/brand/stylex/` and imports only package-owned modules and declared package dependencies.

**Acceptance:**

- [x] No `@bridge/web`, `@cue/web`, product i18n, product hooks, or product utility imports exist in the feature.
- [x] No queue status mapper, holiday query, domain DTO, mutation, or route behavior is exported.

### REQ-002: Public export

`BridgeCalendar` is publicly available through both the package root and the stable `@bridge/ui/bridge-calendar` subpath. The existing `Calendar` date-picker export remains unchanged.

**Acceptance:**

- [x] Package declaration, ESM output, subpath export, root export, and tree-shaking verification resolve.
- [x] `@bridge/ui/calendar` keeps its existing date-picker behavior.

### REQ-003: Generic data and copy contract

Events provide an id, title, start/end dates, and optional presentation metadata. Holidays provide id, title, start/end dates. Every visible default control label and displayed period is caller supplied.

**Acceptance:**

- [x] The public event model contains no queue, venue, province, or schedule status field.
- [x] `labels` supplies previous/next/today, all view labels, seven weekday labels, overflow text, and optional pagination text.
- [x] `labels.period` receives the active view, anchor date, and visible week range; the package does not hard-code browser-locale period text.
- [x] `labels.period` receives the active period context; the package does not format a browser-locale date string.
- [x] The caller can replace default event and empty content through render props.

### REQ-004: View and date state

The component supports `scheduled`, `week`, and `month`. `view` and `date` are controlled when supplied; `defaultView` and `defaultDate` initialize local state otherwise.

**Acceptance:**

- [x] Previous/next move one day in scheduled view, seven days in week view, and one month in month view.
- [x] Today updates the displayed date to the current local day.
- [x] User interaction calls callbacks exactly once and does not overwrite a controlled parent value.
- [x] Programmatic controlled prop changes update the rendered view and period.

### REQ-005: Events, holidays, and intent

Each view renders events intersecting its displayed period. Holidays are informational context and never activate event callbacks. Consumers receive event activation, slot selection, month drop, and pagination as typed UI intents.

**Acceptance:**

- [x] A range ending exactly at a day start does not render on that following day.
- [x] A multi-day holiday highlights each intersected day in week and month views.
- [x] Event activation returns the original event object.
- [x] A week selection snaps to the documented interval and returns a positive time range.
- [x] Simultaneous timed events have non-overlapping horizontal positions, and `allDay` events render in a separate week lane.
- [x] `weekStartsOn` controls the displayed week boundary and weekday order.
- [x] A month empty-day selection and HTML drag/drop each return a consumer-owned slot-selection intent.
- [x] The scheduled intersection sentinel calls `onLoadMore` only when `hasMore` is true and `isLoadingMore` is false.

### REQ-006: Accessibility and lifecycle

Interactive calendar controls are named, keyboard reachable, and visibly focused. Client-only APIs do not run during SSR and all subscriptions are cleaned up.

**Acceptance:**

- [x] Navigation, view selection, event activation, and the selected keyboard slot interaction are operable without a pointer.
- [x] View controls follow the package Tabs keyboard behavior and link the active tab to its panel.
- [x] Observer, document listener, timer, and focus behavior clean up on unmount.
- [x] SSR fixture renders without `window`, `document`, or `IntersectionObserver` access during render.

## API

```tsx
import { BridgeCalendar, type BridgeCalendarEvent, type BridgeCalendarLabels } from "@bridge/ui/bridge-calendar"
import "@bridge/ui/style.css"

const labels: BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view, date, week }) =>
    view === "week" && week ? `${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()}` : `${view}: ${date.toLocaleDateString()}`,
  moreEvent: (count) => `+${count} more`
}

const event: BridgeCalendarEvent = {
  id: "event-1",
  title: "Team rehearsal",
  start: new Date(2026, 8, 15, 9),
  end: new Date(2026, 8, 15, 10),
  tone: "info",
  meta: "Studio A"
}

<BridgeCalendar
  defaultView="week"
  defaultDate={new Date(2026, 8, 15)}
  events={[event]}
  labels={labels}
  onEventActivate={(nextEvent) => openEvent(nextEvent.id)}
  onSlotSelect={(selection) => beginDraft(selection)}
/>
```

## Non-Goals

- Migrating Bridge Web to the package component in this repository.
- Fetching events or holidays.
- Queue status colors, product-specific event card fields, or translated default copy.
- Persisting drag/drop or slot selection.
- Replacing `Calendar`, the existing single-date/range picker.
