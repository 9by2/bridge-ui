# Spec: Bridge Calendar (consumer parity extension)

**Spec ID:** `bridge-calendar`
**Proposal:** `consumer-gap-close`
**Status:** accepted
**Extends:** [plan/spec/bridge-calendar/spec.md](../../../spec/bridge-calendar/spec.md). REQ-001 through REQ-006 stay unchanged; this adds REQ-007 through REQ-010 and is merged into the canonical spec on archive.

## Requirements

### REQ-007: Event color and muted

`BridgeCalendarEvent.color?: string` is any CSS color. It overrides `tone` through the custom property `--bridge-calendar-event-color` on the default event element in every view. `muted?: boolean` de-emphasises a past or cancelled event, exposes `data-muted`, and stays activatable unless `disabled`.

**Acceptance:**

- [x] Default event exposes `--bridge-calendar-event-color` equal to `color` in scheduled, week and month views; with no `color`, the property is unset and tone applies.
- [x] `muted` exposes `data-muted="true"` and still calls `onEventActivate`.

### REQ-008: Holiday meta and render

`BridgeCalendarHoliday.meta?: ReactNode`. `renderHoliday?: (holiday, context: { view, date }) => ReactNode` replaces default holiday content in week and month views, once per intersected day. Default rendering shows `title` and, when present, `meta`.

**Acceptance:**

- [x] `renderHoliday` receives the original holiday (including `meta`) and the day context for each intersected day.
- [x] Default rendering shows `meta`.

### REQ-009: Month drag-hover

While an external HTML draggable is over a month day, that day exposes `data-drop-target="true"`. The state clears on drag leave, drop and document `dragend`. Drop behavior (REQ-005 `onSlotDrop`) is unchanged.

**Acceptance:**

- [x] Browser: dragging over a day sets the highlight on exactly that day; moving to another day moves it; dropping clears it and calls `onSlotDrop` once.

### REQ-010: Activation mapping

`onEventActivate` fires for pointer click and for keyboard Enter/Space on the focused default event (native button). It replaces the consumer's `onEventClick` + `onEventOpen` pair: both map to `onEventActivate`. Disabled events never activate.

**Acceptance:**

- [x] Component: click activates; disabled does not.
- [x] Browser: focus an event and press Enter → `onEventActivate` once.

## Schema / API

```ts
export type BridgeCalendarEvent = {
  // existing: id, title, start, end, tone?, meta?, icon?, allDay?, disabled?
  color?: string
  muted?: boolean
}
export type BridgeCalendarHoliday = { id: string; title: ReactNode; start: Date; end: Date; meta?: ReactNode }
export type BridgeCalendarHolidayContext = { view: BridgeCalendarView; date: Date }
export type BridgeCalendarProps = {
  // existing …
  renderHoliday?: (holiday: BridgeCalendarHoliday, context: BridgeCalendarHolidayContext) => ReactNode
}
```

## Non-Goals

- Calendar-owned event drag/move persistence.
- Product queue status → color mapping (the app maps its status onto `color` or `tone`).
