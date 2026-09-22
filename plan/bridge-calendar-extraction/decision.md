# Decisions: Bridge Calendar Extraction

| ID      | Title                                                 | Status   |
| ------- | ----------------------------------------------------- | -------- |
| DEC-001 | Preserve a separate schedule-calendar name            | accepted |
| DEC-002 | Package owns UI intent, consumers own domain behavior | accepted |
| DEC-003 | Visible copy enters through labels and slots          | accepted |
| DEC-004 | Use explicit controlled and uncontrolled props        | accepted |

---

### DEC-001: Preserve a separate schedule-calendar name

**GIVEN** `@bridge/ui/calendar` already exports a `react-day-picker` date picker.
**WHEN** the multi-view schedule calendar is extracted.
**THEN** it is named `BridgeCalendar` and published from `@bridge/ui/bridge-calendar`, without changing the existing date-picker contract.

---

### DEC-002: Package owns UI intent, consumers own domain behavior

**GIVEN** Bridge Web currently maps queues, holiday DTOs, and event-proposal actions into the calendar.
**WHEN** calendar interaction occurs.
**THEN** the package emits typed callbacks only; consumers own mapping, queries, mutations, authorization, routing, and drag payload interpretation.

---

### DEC-003: Visible copy enters through labels and slots

**GIVEN** package source cannot own product i18n and the existing calendar contains Thai-only messages.
**WHEN** the extracted component needs controls, weekday headings, empty content, pagination text, or overflow text.
**THEN** consumers provide `labels`, `renderEmpty`, and event render content through the public API.

---

### DEC-004: Use explicit controlled and uncontrolled props

**GIVEN** the source treats `view` as an initial value and does not consume its `date` prop, making parent synchronization ambiguous.
**WHEN** publishing the package API.
**THEN** `view` and `date` are controlled values, `defaultView` and `defaultDate` initialize local state, and callbacks report only user-initiated changes.

---

### DEC-005: Week selection is time-based and pointer-accessible

**GIVEN** week view represents timed schedules rather than all-day event groups.
**WHEN** a user points or drags within one weekday column.
**THEN** the package emits a 15-minute-snapped same-day range through `onSlotSelect`; keyboard activation selects the default one-hour range, and event controls never start a range selection.

---

### DEC-006: Consumers own time and current-time copy

**GIVEN** all visible product copy must enter the package through the public contract.
**WHEN** week view renders its time ruler or announces the current-time marker.
**THEN** `labels.time` formats hour labels and `labels.currentTime` supplies the marker’s accessible name; the component owns only the current local-time calculation and one-minute refresh.

---

### DEC-007: Month events use compact time-aware pills

**GIVEN** month cells must support dense schedules without repeating the large schedule-card treatment.
**WHEN** month view renders an event.
**THEN** default timed events use a compact caller-formatted time prefix, and `allDay` events render as compact inverted `[ALL DAY]` pills without a time prefix in month view.

---

### DEC-008: Preserve generic schedule parity with Bridge Web

**GIVEN** Bridge Web establishes reusable schedule interaction expectations but retains product mapping and composition.
**WHEN** package parity is evaluated.
**THEN** Bridge UI owns overlap packing, all-day week placement, configurable week starts, period formatting, accessible tabs, automatic pagination, and initial timed-week scroll; Bridge Web retains queue fields, status mapping, authorization, drag payloads, and detail sheets.

---

### DEC-009: Consumers format displayed periods

**GIVEN** a browser locale cannot safely represent product-specific date calendars or languages.
**WHEN** the calendar displays a header period.
**THEN** `labels.period` receives the active view, anchor date, and displayed week range and returns all visible period copy.
