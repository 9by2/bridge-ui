import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import {
  BridgeCalendar,
  type BridgeCalendarEvent,
  type BridgeCalendarLabels
} from "../../app/component/brand/stylex/bridge-calendar"

const labels: BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view, date, week }) =>
    view === "week" ? `${week?.start.getDate()}-${week?.end.getDate()} September` : `${view} ${date.getDate()}`,
  time: (hour, minute = 0) => `${hour}:${String(minute).padStart(2, "0")}`,
  currentTime: "Current time",
  moreEvent: (count) => `+${count} more`,
  scheduledEmpty: "Nothing scheduled",
  loadMore: "Loading more"
}

const event: BridgeCalendarEvent = {
  id: "event-1",
  title: "Team rehearsal",
  start: new Date(2026, 8, 15, 9),
  end: new Date(2026, 8, 15, 10),
  meta: "Studio A",
  tone: "info"
}

afterEach(cleanup)

describe("BridgeCalendar", () => {
  test("reports navigation and view changes through its public controls", () => {
    const onDateChange = vi.fn()
    const onViewChange = vi.fn()

    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[event]}
        labels={labels}
        onDateChange={onDateChange}
        onViewChange={onViewChange}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Next period" }))
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 8, 22))
    fireEvent.click(screen.getByRole("tab", { name: "Month" }))
    expect(onViewChange).toHaveBeenCalledWith("month")
  })

  test("uses controlled values until the consumer updates them", () => {
    const onViewChange = vi.fn()
    const { rerender } = render(
      <BridgeCalendar
        view="scheduled"
        date={new Date(2026, 8, 15)}
        events={[event]}
        labels={labels}
        onViewChange={onViewChange}
      />
    )

    fireEvent.click(screen.getByRole("tab", { name: "Month" }))
    expect(onViewChange).toHaveBeenCalledWith("month")
    expect(screen.getByRole("tabpanel").dataset.view).toBe("scheduled")
    rerender(
      <BridgeCalendar
        view="month"
        date={new Date(2026, 8, 15)}
        events={[event]}
        labels={labels}
        onViewChange={onViewChange}
      />
    )
    expect(screen.getByRole("tabpanel").dataset.view).toBe("month")
  })

  test("activates the original event and excludes a midnight-ended event from the following day", () => {
    const onEventActivate = vi.fn()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="scheduled"
        events={[
          event,
          { ...event, id: "ended", title: "Ended", start: new Date(2026, 8, 14, 22), end: new Date(2026, 8, 15) }
        ]}
        labels={labels}
        onEventActivate={onEventActivate}
      />
    )

    expect(screen.queryByRole("button", { name: /Ended/ })).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: /Team rehearsal/ }))
    expect(onEventActivate).toHaveBeenCalledWith(event)
  })

  test("reports month day selection and generic drop intent", () => {
    const onSlotSelect = vi.fn()
    const onSlotDrop = vi.fn()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="month"
        events={[]}
        labels={labels}
        onSlotDrop={onSlotDrop}
        onSlotSelect={onSlotSelect}
      />
    )

    const day = screen.getByRole("button", { name: "2026-09-16" })
    fireEvent.click(day)
    expect(onSlotSelect).toHaveBeenCalledWith({ start: new Date(2026, 8, 16, 9), end: new Date(2026, 8, 16, 10) })
    fireEvent.drop(day, { dataTransfer: { dropEffect: "move" } })
    expect(onSlotDrop).toHaveBeenCalledWith({ start: new Date(2026, 8, 16, 9), end: new Date(2026, 8, 16, 10) })
  })

  test("keeps month day selection separate from event activation", () => {
    const onSlotSelect = vi.fn()
    const onEventActivate = vi.fn()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="month"
        events={[event]}
        labels={labels}
        onEventActivate={onEventActivate}
        onSlotSelect={onSlotSelect}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Team rehearsal" }))
    expect(onEventActivate).toHaveBeenCalledWith(event)
    expect(onSlotSelect).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "2026-09-15" }))
    expect(onSlotSelect).toHaveBeenCalledWith({ start: new Date(2026, 8, 15, 9), end: new Date(2026, 8, 15, 10) })
  })

  test("requests another scheduled page only when available and idle", () => {
    const onLoadMore = vi.fn()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        events={[event]}
        hasMore
        labels={labels}
        onLoadMore={onLoadMore}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Load more" }))
    expect(onLoadMore).toHaveBeenCalledOnce()
  })

  test("supports supplied event and empty renderers, disabled loading, and keyboard day selection", () => {
    const onSlotSelect = vi.fn()
    const onEventActivate = vi.fn()
    const { rerender } = render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        events={[]}
        hasMore
        isLoadingMore
        labels={labels}
        renderEmpty={() => <span>Custom empty</span>}
      />
    )
    expect(screen.getByText("Custom empty")).toBeTruthy()

    rerender(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[
          { ...event, disabled: true },
          { ...event, id: "custom" }
        ]}
        holidays={[{ id: "holiday", title: "Holiday", start: new Date(2026, 8, 15), end: new Date(2026, 8, 16) }]}
        labels={labels}
        onEventActivate={onEventActivate}
        onSlotSelect={onSlotSelect}
        renderEvent={(nextEvent) => (
          <button type="button" onClick={() => onEventActivate(nextEvent)}>
            Custom {nextEvent.id}
          </button>
        )}
      />
    )
    fireEvent.click(screen.getByRole("tab", { name: "Week" }))
    fireEvent.keyDown(screen.getByRole("button", { name: "2026-09-15" }), { key: "Enter" })
    expect(onSlotSelect).toHaveBeenCalledWith({ start: new Date(2026, 8, 15, 9), end: new Date(2026, 8, 15, 10) })
    fireEvent.click(screen.getByRole("button", { name: "Custom custom" }))
    expect(onEventActivate).toHaveBeenCalledWith(expect.objectContaining({ id: "custom" }))
  })

  test("moves scheduled dates by day and month dates by month", () => {
    const onDateChange = vi.fn()
    const { unmount } = render(
      <BridgeCalendar defaultDate={new Date(2026, 8, 15)} events={[]} labels={labels} onDateChange={onDateChange} />
    )
    fireEvent.click(screen.getByRole("button", { name: "Previous period" }))
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 8, 14))
    unmount()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="month"
        events={[]}
        labels={labels}
        onDateChange={onDateChange}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Next period" }))
    expect(onDateChange).toHaveBeenCalledWith(new Date(2026, 9, 15))
  })

  test("renders timed week rows and identifies the current time in the visible week", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 15, 10, 30))
    render(<BridgeCalendar defaultDate={new Date(2026, 8, 15)} defaultView="week" events={[event]} labels={labels} />)

    expect(screen.getByText("10:00")).toBeTruthy()
    expect(screen.getByLabelText("Current time").getAttribute("data-minute")).toBe("630")
    vi.useRealTimers()
  })

  test("selects a 15-minute-snapped time range after dragging within a week day", () => {
    const onSlotSelect = vi.fn()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[]}
        labels={labels}
        onSlotSelect={onSlotSelect}
      />
    )

    const day = screen.getByRole("button", { name: "2026-09-15" })
    vi.spyOn(day, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 100, 1440))
    fireEvent.mouseDown(day, { clientY: 555 })
    fireEvent.mouseMove(document, { clientY: 675 })
    fireEvent.mouseUp(document, { clientY: 675 })

    expect(onSlotSelect).toHaveBeenCalledWith({
      start: new Date(2026, 8, 15, 9, 15),
      end: new Date(2026, 8, 15, 11, 15)
    })
  })

  test("activates a week event without selecting its time slot", () => {
    const onEventActivate = vi.fn()
    const onSlotSelect = vi.fn()
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[event]}
        labels={labels}
        onEventActivate={onEventActivate}
        onSlotSelect={onSlotSelect}
      />
    )

    fireEvent.mouseDown(screen.getByRole("button", { name: "Team rehearsal" }), { clientY: 540 })
    fireEvent.click(screen.getByRole("button", { name: "Team rehearsal" }))
    expect(onEventActivate).toHaveBeenCalledWith(event)
    expect(onSlotSelect).not.toHaveBeenCalled()
  })

  test("marks the complete timed column and heading for a holiday", () => {
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[]}
        holidays={[
          { id: "holiday", title: "Company holiday", start: new Date(2026, 8, 15), end: new Date(2026, 8, 16) }
        ]}
        labels={labels}
      />
    )

    expect(screen.getAllByText("Company holiday")).toHaveLength(1)
    expect(document.querySelectorAll('[data-holiday="true"]')).toHaveLength(2)
  })

  test("renders compact timed and all-day month events", () => {
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="month"
        events={[
          event,
          {
            ...event,
            id: "all-day",
            title: "Company offsite",
            start: new Date(2026, 8, 16),
            end: new Date(2026, 8, 17),
            allDay: true
          }
        ]}
        labels={labels}
      />
    )

    expect(screen.getByText("9:00")).toBeTruthy()
    expect(screen.getByText("[ALL DAY] Company offsite")).toBeTruthy()
    expect(screen.queryByText("0:00")).toBeNull()
  })

  test("positions overlapping timed week events in separate columns", () => {
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[
          event,
          { ...event, id: "overlap", title: "Overlapping rehearsal", start: new Date(2026, 8, 15, 9, 30) }
        ]}
        labels={labels}
      />
    )

    const first = screen.getByRole("button", { name: "Team rehearsal" }).parentElement
    const second = screen.getByRole("button", { name: "Overlapping rehearsal" }).parentElement
    expect(first?.style.left).not.toBe(second?.style.left)
    expect(first?.style.width).toBe("50%")
    expect(second?.style.width).toBe("50%")
  })

  test("renders all-day week events outside the timed grid", () => {
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[
          {
            ...event,
            id: "all-day-week",
            title: "All-day offsite",
            start: new Date(2026, 8, 15),
            end: new Date(2026, 8, 16),
            allDay: true
          }
        ]}
        labels={labels}
      />
    )

    expect(
      screen.getByRole("button", { name: "All-day offsite" }).closest('[data-slot="bridge-calendar-all-day"]')
    ).toBeTruthy()
  })

  test("uses caller-provided period copy and honors Monday week boundaries", () => {
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="week"
        events={[]}
        labels={labels}
        weekStartsOn={1}
      />
    )

    expect(screen.getByText("14-20 September")).toBeTruthy()
    expect(screen.getByRole("button", { name: "2026-09-14" })).toBeTruthy()
  })

  test("uses accessible package tabs for keyboard view selection", () => {
    render(<BridgeCalendar defaultDate={new Date(2026, 8, 15)} events={[]} labels={labels} />)

    const scheduled = screen.getByRole("tab", { name: "Schedule" })
    scheduled.focus()
    fireEvent.keyDown(scheduled, { key: "ArrowRight" })
    expect(screen.getByRole("tab", { name: "Week" }).getAttribute("aria-selected")).toBe("true")
  })

  test("renders optional header action, event metadata, icon, and every event tone", () => {
    render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        events={[
          ...(["neutral", "info", "success", "warning", "danger"] as const).map((tone) => ({
            ...event,
            id: tone,
            title: tone,
            tone,
            icon: <span>Icon</span>
          }))
        ]}
        labels={labels}
        action={<button type="button">Create event</button>}
      />
    )

    expect(screen.getByRole("button", { name: "Create event" })).toBeTruthy()
    expect(screen.getAllByText("Studio A")).toHaveLength(5)
    expect(screen.getAllByText("Icon")).toHaveLength(5)
  })

  test("observes the scheduled pagination sentinel and disconnects it on unmount", () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    const onLoadMore = vi.fn()
    const OriginalIntersectionObserver = globalThis.IntersectionObserver
    class IntersectionObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
      }
      disconnect = disconnect
      observe = observe
      root = null
      rootMargin = ""
      thresholds = []
      takeRecords() {
        return []
      }
      unobserve() {}
    }
    globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver

    const { unmount } = render(
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        events={[event]}
        hasMore
        labels={labels}
        onLoadMore={onLoadMore}
      />
    )
    expect(observe).toHaveBeenCalledOnce()
    expect(onLoadMore).toHaveBeenCalledOnce()
    unmount()
    expect(disconnect).toHaveBeenCalledOnce()
    globalThis.IntersectionObserver = OriginalIntersectionObserver
  })

  test("scrolls the week panel near the current time and renders only required month rows", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 15, 10, 30))
    const { unmount } = render(
      <BridgeCalendar defaultDate={new Date(2026, 8, 15)} defaultView="week" events={[]} labels={labels} />
    )
    expect(screen.getByRole("tabpanel").scrollTop).toBe(510)
    unmount()
    render(<BridgeCalendar defaultDate={new Date(2026, 8, 15)} defaultView="month" events={[]} labels={labels} />)
    expect(screen.getAllByRole("button", { name: /^2026-/ })).toHaveLength(35)
    vi.useRealTimers()
  })
})
