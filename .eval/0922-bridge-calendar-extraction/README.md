# Bridge Calendar Extraction Evidence

- `verify.ts`: Bun.WebView runner.
- `steps.md`: reproduction instructions.
- `bridge-calendar-desktop.png`: desktop render.
- `bridge-calendar-mobile.png`: mobile render.
- `report.json`: structural and overflow results.

Timed-week catalog accessibility passed: `bridge-calendar/default renders accessibly`.

The full catalog browser suite has one unrelated failure: `swim-lane-board/default` uses `aria-label` on a `div` without a valid role. BridgeCalendar passes its catalog accessibility check.
