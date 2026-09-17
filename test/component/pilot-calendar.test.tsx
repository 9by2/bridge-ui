import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { CalendarDay } from "react-day-picker"
import { afterEach, expect, test, vi } from "vitest"

import { Calendar, CalendarDayButton } from "../../app/component/brand/stylex/calendar"

afterEach(cleanup)
test("calendar range dropdown and week number retain engine slot", () => {
  render(
    <Calendar
      mode="range"
      defaultMonth={new Date(2026, 8, 1)}
      selected={{ from: new Date(2026, 8, 10), to: new Date(2026, 8, 14) }}
      captionLayout="dropdown"
      showWeekNumber
    />
  )
  expect(screen.getByRole("combobox", { name: /month/i })).toBeTruthy()
  expect(document.querySelector('[data-range-middle="true"]')).not.toBeNull()
})
test("calendar day receives engine focused modifier", () => {
  render(
    <CalendarDayButton
      day={new CalendarDay(new Date(2026, 8, 15), new Date(2026, 8, 1))}
      modifiers={{ focused: true }}
      aria-label="Focused day">
      15
    </CalendarDayButton>
  )
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Focused day" }))
})
test("calendar retains engine date selection and navigation", () => {
  const select = vi.fn()
  render(<Calendar mode="single" defaultMonth={new Date(2026, 8, 1)} onSelect={select} />)
  fireEvent.click(screen.getByRole("button", { name: /September 15th, 2026/ }))
  expect(select.mock.calls[0]?.[0]).toEqual(new Date(2026, 8, 15))
  fireEvent.click(screen.getByRole("button", { name: /next month/i }))
  expect(screen.getByText("October 2026")).toBeTruthy()
})

test("calendar uses stable ISO day and avoids stealing unrelated focus", () => {
  const day = new CalendarDay(new Date(2026, 8, 15), new Date(2026, 8, 1))
  const { rerender } = render(
    <>
      <button type="button">Unrelated control</button>
      <CalendarDayButton day={day} modifiers={{ focused: false }} aria-label="September day">
        15
      </CalendarDayButton>
    </>
  )
  const unrelated = screen.getByRole("button", { name: "Unrelated control" })
  unrelated.focus()
  rerender(
    <>
      <button type="button">Unrelated control</button>
      <CalendarDayButton day={day} modifiers={{ focused: true }} aria-label="September day">
        15
      </CalendarDayButton>
    </>
  )
  expect(screen.getByRole("button", { name: "September day" }).dataset.day).toBe("2026-09-15")
  expect(document.activeElement).toBe(unrelated)
})
