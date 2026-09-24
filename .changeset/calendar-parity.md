---
"@bridge/ui": minor
---

Add `BridgeCalendar` event color, muted state, holiday render and month drag-hover.

- `BridgeCalendarEvent` `color` (any CSS color, exposed as `--bridge-calendar-event-color`, overrides `tone`) and `muted`.
- `BridgeCalendarHoliday` `meta` and `renderHoliday(holiday, { view, date })`.
- Month days show a drop-target highlight (`data-drop-target`) while an external draggable is over them. It clears on leave, drop or `dragend`.
- `onEventActivate` is documented as the mapping for both click and keyboard open.
