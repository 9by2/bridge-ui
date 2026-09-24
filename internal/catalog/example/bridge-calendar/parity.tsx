import { useState } from "react"

import {
  BridgeCalendar,
  Badge,
  type BridgeCalendarEvent,
  type BridgeCalendarHoliday,
  type BridgeCalendarLabels
} from "@bridge/ui"

const labels: BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view, date }) => `${view}: ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
  time: (hour, minute = 0) => `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  currentTime: "Current time",
  moreEvent: (count) => `+${count} more`
}

const event: BridgeCalendarEvent[] = [
  {
    id: "launch",
    title: "Brand launch",
    start: new Date(2026, 8, 15, 9),
    end: new Date(2026, 8, 15, 10),
    color: "#7c3aed"
  },
  {
    id: "cancelled",
    title: "Cancelled rehearsal",
    start: new Date(2026, 8, 14, 13),
    end: new Date(2026, 8, 14, 14),
    muted: true
  },
  {
    id: "festival",
    title: "Festival",
    start: new Date(2026, 8, 22),
    end: new Date(2026, 8, 23),
    allDay: true,
    color: "#0f766e"
  },
  {
    id: "review",
    title: "Release review",
    start: new Date(2026, 8, 24, 11),
    end: new Date(2026, 8, 24, 12),
    tone: "info"
  }
]

const holiday: BridgeCalendarHoliday[] = [
  {
    id: "harvest",
    title: "Harvest day",
    meta: "Office closed",
    start: new Date(2026, 8, 17),
    end: new Date(2026, 8, 19)
  }
]

export default function Example() {
  const [log, setLog] = useState("Drag the chip onto a day, or activate an event.")
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-3 text-sm">
        <span
          draggable
          data-testid="external-draggable"
          onDragStart={(dragEvent) => dragEvent.dataTransfer.setData("text/plain", "queue-item")}
          className="cursor-grab rounded-md border px-2 py-1">
          Drag queue item
        </span>
        <output aria-label="Calendar event log" className="min-w-0 break-words">
          {log}
        </output>
      </div>
      <BridgeCalendar
        defaultDate={new Date(2026, 8, 15)}
        defaultView="month"
        events={event}
        holidays={holiday}
        labels={labels}
        renderHoliday={(item, context) =>
          context.date.getDate() === item.start.getDate() ? (
            <Badge variant="secondary">{item.title}</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">{item.meta}</span>
          )
        }
        onEventActivate={(item) => setLog(`activate: ${item.id}`)}
        onSlotDrop={(selection) => setLog(`drop: ${selection.start.toDateString()}`)}
      />
    </div>
  )
}
