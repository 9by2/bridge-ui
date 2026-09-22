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
    id: "rehearsal",
    title: "Team rehearsal",
    start: new Date(2026, 8, 22, 9),
    end: new Date(2026, 8, 22, 11),
    meta: "Studio A",
    tone: "info"
  },
  {
    id: "soundcheck",
    title: "Sound check",
    start: new Date(2026, 8, 23, 14),
    end: new Date(2026, 8, 23, 15),
    meta: "Main stage",
    tone: "success"
  },
  {
    id: "lighting",
    title: "Lighting check",
    start: new Date(2026, 8, 23, 14, 30),
    end: new Date(2026, 8, 23, 15, 30),
    meta: "Main stage",
    tone: "warning"
  },
  {
    id: "thai-copy",
    title: "ประชุมเตรียมงานเทศกาลดนตรีประจำปี",
    start: new Date(2026, 8, 24, 10),
    end: new Date(2026, 8, 24, 12),
    meta: "Bangkok office",
    tone: "warning"
  },
  {
    id: "offsite",
    title: "Company offsite",
    start: new Date(2026, 8, 25),
    end: new Date(2026, 8, 26),
    allDay: true,
    tone: "success"
  }
]

export default function Example() {
  return (
    <BridgeCalendar
      defaultDate={new Date(2026, 8, 22)}
      events={event}
      holidays={[{ id: "holiday", title: "Company holiday", start: new Date(2026, 8, 25), end: new Date(2026, 8, 26) }]}
      hasMore
      labels={labels}
      onEventActivate={(activeEvent) => window.alert(`Open ${activeEvent.id}`)}
      onLoadMore={() => window.alert("Load more schedules")}
      onSlotSelect={(selection) => window.alert(`Create ${selection.start.toLocaleString()}`)}
    />
  )
}
