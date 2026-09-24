import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  BridgeCalendar,
  bridgeCalendarView,
  type BridgeCalendarEvent,
  type BridgeCalendarHoliday,
  type BridgeCalendarLabels
} from "../../app/component/brand/stylex/bridge-calendar"

afterEach(cleanup)

const labels: BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view }) => view,
  time: (hour, minute = 0) => `${hour}:${String(minute).padStart(2, "0")}`,
  currentTime: "Current time",
  moreEvent: (count) => `+${count} more`
}

const colored: BridgeCalendarEvent = {
  id: "colored",
  title: "Brand launch",
  start: new Date(2026, 8, 15, 9),
  end: new Date(2026, 8, 15, 10),
  tone: "info",
  color: "#7c3aed"
}
const past: BridgeCalendarEvent = {
  id: "past",
  title: "Cancelled rehearsal",
  start: new Date(2026, 8, 15, 11),
  end: new Date(2026, 8, 15, 12),
  muted: true
}
const holiday: BridgeCalendarHoliday = {
  id: "h",
  title: "Harvest day",
  meta: "Office closed",
  start: new Date(2026, 8, 16),
  end: new Date(2026, 8, 18)
}

// Protects REQ-007: a consumer color reaches the event through the documented custom property in every view;
// events without color keep tone styling (no property).
test.each(Object.values(bridgeCalendarView))("event color is exposed as a custom property in %s view", (view) => {
  render(
    <BridgeCalendar defaultDate={new Date(2026, 8, 15)} defaultView={view} events={[colored, past]} labels={labels} />
  )
  const [withColor, without] = [
    screen.getByRole("button", { name: "Brand launch" }),
    screen.getByRole("button", { name: "Cancelled rehearsal" })
  ]
  expect(withColor.style.getPropertyValue("--bridge-calendar-event-color")).toBe("#7c3aed")
  expect(without.style.getPropertyValue("--bridge-calendar-event-color")).toBe("")
})

// Protects REQ-007/REQ-010: muted is observable and still activates; disabled never activates.
test("muted event stays activatable and disabled event does not activate", () => {
  const activate = vi.fn()
  render(
    <BridgeCalendar
      defaultDate={new Date(2026, 8, 15)}
      defaultView="scheduled"
      events={[past, { ...colored, disabled: true }]}
      labels={labels}
      onEventActivate={activate}
    />
  )
  const muted = screen.getByRole("button", { name: "Cancelled rehearsal" })
  expect(muted.getAttribute("data-muted")).toBe("true")
  fireEvent.click(muted)
  fireEvent.click(screen.getByRole("button", { name: "Brand launch" }))
  expect(activate).toHaveBeenCalledOnce()
  expect(activate).toHaveBeenCalledWith(past)
})

// Protects REQ-008: renderHoliday receives the original holiday and each intersected day context.
test.each([bridgeCalendarView.week, bridgeCalendarView.month])(
  "renderHoliday receives holiday and day context in %s view",
  (view) => {
    const renderHoliday = vi.fn((item: BridgeCalendarHoliday, context: { view: string; date: Date }) => (
      <span>
        {item.title} / {item.meta} / {context.date.getDate()}
      </span>
    ))
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView={view}
        events={[]}
        holidays={[holiday]}
        renderHoliday={renderHoliday}
        labels={labels}
      />
    )
    expect(screen.getByText("Harvest day / Office closed / 16")).toBeTruthy()
    expect(screen.getByText("Harvest day / Office closed / 17")).toBeTruthy()
    expect(renderHoliday.mock.calls.every(([item, context]) => item === holiday && context.view === view)).toBe(true)
  }
)

// Protects REQ-008: default holiday rendering surfaces meta.
test("default holiday rendering shows meta", () => {
  render(
    <BridgeCalendar
      defaultDate={new Date(2026, 8, 15)}
      defaultView="month"
      events={[]}
      holidays={[holiday]}
      labels={labels}
    />
  )
  expect(screen.getAllByText("Office closed")).toHaveLength(2)
})

// Protects REQ-009 state transitions at the component seam (browser suite covers real DragEvent input):
// enter highlights, leaving into a child keeps it, leaving to another day clears it, drop clears and reports,
// dragend clears an abandoned drag.
test("month drop-target state follows enter, leave, drop and dragend", () => {
  const drop = vi.fn()
  render(
    <BridgeCalendar
      defaultDate={new Date(2026, 8, 15)}
      defaultView="month"
      events={[]}
      labels={labels}
      onSlotDrop={drop}
    />
  )
  const cell = (day: string) => screen.getByRole("button", { name: day }).parentElement!
  const target = () => document.querySelector('[data-drop-target="true"] > button')?.getAttribute("aria-label")
  // jsdom has no DragEvent; MouseEvent carries relatedTarget for the leave transition.
  const leave = (from: HTMLElement, to: Element | null) =>
    fireEvent(from, new MouseEvent("dragleave", { bubbles: true, relatedTarget: to }))
  fireEvent.dragEnter(cell("2026-09-10"))
  expect(target()).toBe("2026-09-10")
  leave(cell("2026-09-10"), screen.getByRole("button", { name: "2026-09-10" }))
  expect(target()).toBe("2026-09-10")
  fireEvent.dragEnter(cell("2026-09-11"))
  leave(cell("2026-09-10"), cell("2026-09-11"))
  expect(target()).toBe("2026-09-11")
  leave(cell("2026-09-11"), null)
  expect(target()).toBeUndefined()
  fireEvent.dragEnter(cell("2026-09-12"))
  fireEvent.dragOver(cell("2026-09-12"))
  fireEvent.drop(cell("2026-09-12"))
  expect(target()).toBeUndefined()
  expect(drop).toHaveBeenCalledOnce()
  expect(drop.mock.calls[0]?.[0].start.getDate()).toBe(12)
  fireEvent.dragEnter(cell("2026-09-13"))
  expect(target()).toBe("2026-09-13")
  fireEvent(document, new Event("dragend"))
  expect(target()).toBeUndefined()
})
