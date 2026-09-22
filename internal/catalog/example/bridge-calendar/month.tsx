import { BridgeCalendar, type BridgeCalendarEvent, type BridgeCalendarLabels } from "@bridge/ui"

const labels: BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view, date, week }) =>
    view === "week" && week
      ? `${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()}`
      : `${view}: ${date.toLocaleDateString()}`,
  time: (hour, minute = 0) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  currentTime: "Current time",
  scheduledEmpty: "Nothing scheduled in this period.",
  loadMore: "Loading more schedules",
  moreEvent: (count) => `+${count} more`
}

const event: BridgeCalendarEvent[] = [
  {
    id: "review",
    title: "Release review",
    start: new Date(2026, 8, 15, 9, 30),
    end: new Date(2026, 8, 15, 10),
    tone: "info"
  },
  {
    id: "soundcheck",
    title: "Sound check",
    start: new Date(2026, 8, 16, 14),
    end: new Date(2026, 8, 16, 15),
    tone: "success"
  },
  {
    id: "offsite",
    title: "Company offsite",
    start: new Date(2026, 8, 17),
    end: new Date(2026, 8, 18),
    allDay: true,
    tone: "warning"
  }
]

export default function Example() {
  return <BridgeCalendar defaultDate={new Date(2026, 8, 15)} defaultView="month" events={event} labels={labels} />
}
