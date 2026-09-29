import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { calendarLabel, day } from "@catalog-prototype/shared/support"
import { useState } from "react"

import * as UI from "@bridge/ui"

const meeting: UI.BridgeCalendarEvent[] = [
  { id: "standup", title: "Platform standup", start: day(21, 9, 30), end: day(21, 9, 45), tone: "info" },
  {
    id: "review",
    title: "Security review",
    start: day(22, 13),
    end: day(22, 14, 30),
    meta: "Room 4B",
    tone: "warning"
  },
  { id: "demo", title: "Customer demo · Globex", start: day(23, 10), end: day(23, 11), meta: "Zoom", tone: "success" },
  { id: "planning", title: "Sprint planning", start: day(24, 14), end: day(24, 16), tone: "info" },
  { id: "offsite", title: "Company offsite", start: day(25), end: day(26), allDay: true, tone: "success" },
  { id: "retro", title: "Retro (cancelled)", start: day(26, 15), end: day(26, 16), muted: true }
]

function Availability() {
  const [date, setDate] = useState<Date | undefined>(() => day(23))
  return (
    <UI.Card>
      <UI.CardHeader>
        <UI.CardTitle>Book a room</UI.CardTitle>
        <UI.CardDescription>{date ? date.toDateString() : "Pick a day"}</UI.CardDescription>
      </UI.CardHeader>
      <UI.CardContent>
        <div className="grid grid-cols-1 gap-4">
          <UI.Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={day(1)} />
          <UI.Field>
            <UI.FieldLabel htmlFor="room-duration">Duration (minute)</UI.FieldLabel>
            <UI.Slider id="room-duration" aria-label="Duration" defaultValue={[60]} min={15} max={180} step={15} />
          </UI.Field>
          <UI.Field orientation="horizontal">
            <UI.Switch id="room-video" defaultChecked />
            <UI.FieldLabel htmlFor="room-video">Video conference</UI.FieldLabel>
          </UI.Field>
        </div>
      </UI.CardContent>
      <UI.CardFooter>
        <UI.Button onClick={() => notify.success("Room 4B booked")}>Book</UI.Button>
      </UI.CardFooter>
    </UI.Card>
  )
}

export function SchedulePage() {
  usePageAction(<UI.Button onClick={() => notify.info("Select a slot on the calendar")}>New meeting</UI.Button>)
  return (
    <UI.Page width={UI.PageWidth.full}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Calendar</UI.PageTitle>
          <UI.PageDescription>Team schedule. Drag a chip in month view to reschedule.</UI.PageDescription>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <UI.BridgeCalendar
            defaultDate={day(21)}
            defaultView="week"
            weekStartsOn={1}
            events={meeting}
            labels={calendarLabel}
            onEventActivate={(item) => notify.info(`Open ${item.id}`)}
            onSlotSelect={(selection) => notify.info(`New meeting at ${selection.start.toLocaleString("en-GB")}`)}
            onSlotDrop={(selection) => notify.success(`Moved to ${selection.start.toLocaleDateString("en-GB")}`)}
          />
          <Availability />
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
