import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { calendarLabel, day, stay } from "@catalog-prototype/shared/support"
import { format } from "date-fns"
import { PlusIcon, SearchIcon } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

import * as UI from "@bridge/ui"

const event: UI.BridgeCalendarEvent[] = [
  { id: "rehearsal", title: "Polycat rehearsal", start: day(22, 9), end: day(22, 11), meta: "Studio A", tone: "info" },
  { id: "soundcheck", title: "Sound check", start: day(23, 14), end: day(23, 15), meta: "Main stage", tone: "success" },
  {
    id: "lighting",
    title: "Lighting check",
    start: day(23, 14, 30),
    end: day(23, 16),
    meta: "Main stage",
    tone: "warning"
  },
  { id: "festival", title: "เทศกาลดนตรีประจำปี", start: day(24, 10), end: day(24, 12), meta: "Bangkok", tone: "warning" },
  { id: "tour", title: "Northern tour", start: day(25), end: day(27), allDay: true, tone: "success" }
]
const venue = [
  {
    id: "EVT-2041",
    name: "Polycat Live in Bangkok",
    venue: "Impact Arena",
    date: "24 Sep 2026",
    sold: "11,420 / 12,000",
    status: "success"
  },
  {
    id: "EVT-2038",
    name: "Indie Night Vol. 7",
    venue: "Lido Connect",
    date: "27 Sep 2026",
    sold: "402 / 600",
    status: "pending"
  },
  {
    id: "EVT-2033",
    name: "ลูกทุ่งมหกรรม",
    venue: "Khon Kaen Hall",
    date: "3 Oct 2026",
    sold: "1,890 / 4,000",
    status: "info"
  },
  {
    id: "EVT-2029",
    name: "Slot Machine Reunion",
    venue: "Thunder Dome",
    date: "11 Oct 2026",
    sold: "0 / 8,000",
    status: "inactive"
  }
] as const

function EventTable({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <UI.TableFrame>
      <UI.TableFrameHint>เลื่อนแนวนอนเพื่อดูคอลัมน์ทั้งหมด</UI.TableFrameHint>
      <UI.TableFrameViewport tabIndex={0} aria-label="Event list">
        <UI.Table>
          <UI.TableHeader>
            <UI.TableRow>
              <UI.TableHead>ID</UI.TableHead>
              <UI.TableHead>Event</UI.TableHead>
              <UI.TableHead>Venue</UI.TableHead>
              <UI.TableHead>Date</UI.TableHead>
              <UI.TableHead>Sold</UI.TableHead>
              <UI.TableHead>Status</UI.TableHead>
            </UI.TableRow>
          </UI.TableHeader>
          <UI.TableBody>
            {venue.map((row) => (
              <UI.ContextMenu key={row.id}>
                <UI.ContextMenuTrigger render={<UI.TableRow />}>
                  <UI.TableCell>{row.id}</UI.TableCell>
                  <UI.TableCell>
                    <UI.Button variant="link" onClick={() => onOpen(row.id)}>
                      {row.name}
                    </UI.Button>
                  </UI.TableCell>
                  <UI.TableCell>{row.venue}</UI.TableCell>
                  <UI.TableCell>{row.date}</UI.TableCell>
                  <UI.TableCell>{row.sold}</UI.TableCell>
                  <UI.TableCell>
                    <UI.StatusStamp tone={row.status}>{row.status}</UI.StatusStamp>
                  </UI.TableCell>
                </UI.ContextMenuTrigger>
                <UI.ContextMenuContent>
                  <UI.ContextMenuLabel>{row.id}</UI.ContextMenuLabel>
                  <UI.ContextMenuItem onClick={() => onOpen(row.id)}>Open detail</UI.ContextMenuItem>
                  <UI.ContextMenuItem onClick={() => notify.info(`${row.id} duplicated`)}>
                    Duplicate
                    <UI.ContextMenuShortcut>⌘D</UI.ContextMenuShortcut>
                  </UI.ContextMenuItem>
                  <UI.ContextMenuSeparator />
                  <UI.ContextMenuItem variant="destructive">Cancel event</UI.ContextMenuItem>
                </UI.ContextMenuContent>
              </UI.ContextMenu>
            ))}
          </UI.TableBody>
        </UI.Table>
      </UI.TableFrameViewport>
    </UI.TableFrame>
  )
}

function EventSheet({ id, onClose }: { id: string | undefined; onClose: () => void }) {
  const row = venue.find((item) => item.id === id)
  return (
    <UI.Sheet open={row !== undefined} onOpenChange={(open) => (open ? undefined : onClose())}>
      <UI.SheetContent>
        <UI.SheetHeader>
          <UI.SheetTitle>{row?.name}</UI.SheetTitle>
          <UI.SheetDescription>
            {row?.venue} · {row?.date}
          </UI.SheetDescription>
        </UI.SheetHeader>
        <div className="grid grid-cols-1 gap-6 px-4">
          <dl className="grid grid-cols-1 gap-3">
            <UI.DetailItem>
              <UI.DetailItemLabel>Event ID</UI.DetailItemLabel>
              <UI.DetailItemContent>{row?.id}</UI.DetailItemContent>
            </UI.DetailItem>
            <UI.DetailItem>
              <UI.DetailItemLabel>Ticket sold</UI.DetailItemLabel>
              <UI.DetailItemContent>{row?.sold}</UI.DetailItemContent>
            </UI.DetailItem>
          </dl>
          <UI.TimelineStep aria-label="Event timeline">
            {(["Announced", "On sale", "Show day"] as const).map((title, index) => {
              const state = index === 0 ? "completed" : index === 1 ? "current" : "upcoming"
              return (
                <UI.TimelineStepItem key={title} state={state}>
                  <UI.TimelineStepHeader>
                    <UI.TimelineStepIndicator tone={state === "completed" ? "primary" : "outline"}>
                      {index + 1}
                    </UI.TimelineStepIndicator>
                    <UI.TimelineStepTitle>{title}</UI.TimelineStepTitle>
                  </UI.TimelineStepHeader>
                  {index < 2 ? <UI.TimelineStepConnector state={state} /> : null}
                  <UI.TimelineStepContent>
                    <UI.TimelineStepTime
                      dateTime={`2026-09-${10 + index * 7}`}>{`${10 + index * 7} Sep`}</UI.TimelineStepTime>
                  </UI.TimelineStepContent>
                </UI.TimelineStepItem>
              )
            })}
          </UI.TimelineStep>
        </div>
        <UI.SheetFooter>
          <UI.SheetClose render={<UI.Button variant="outline" />}>Close</UI.SheetClose>
        </UI.SheetFooter>
      </UI.SheetContent>
    </UI.Sheet>
  )
}

function DateFilter() {
  const [range, setRange] = useState<DateRange | undefined>({ from: day(22), to: day(28) })
  return (
    <UI.Popover>
      <UI.PopoverTrigger render={<UI.Button variant="outline" />}>
        {range?.from ? `${format(range.from, "d MMM")} – ${range.to ? format(range.to, "d MMM") : "…"}` : "Any date"}
      </UI.PopoverTrigger>
      <UI.PopoverContent align="start">
        <UI.Calendar mode="range" selected={range} onSelect={setRange} defaultMonth={day(1)} />
      </UI.PopoverContent>
    </UI.Popover>
  )
}

export function EventPage() {
  const [open, setOpen] = useState<string>()
  usePageAction(
    <UI.Button onClick={() => notify.success("Draft event created")}>
      <PlusIcon aria-hidden="true" />
      New event
    </UI.Button>
  )
  return (
    <UI.Page width={UI.PageWidth.full}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Event</UI.PageTitle>
          <UI.PageMeta>
            <UI.Badge variant="secondary">{venue.length} upcoming</UI.Badge>
            <span>Right-click a row for more action</span>
          </UI.PageMeta>
        </UI.PageHeading>
        <UI.PageFilter role="search" aria-label="Event filter">
          <UI.InputGroup>
            <UI.InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </UI.InputGroupAddon>
            <UI.InputGroupInput aria-label="Search event" placeholder="Search event" />
            <UI.InputGroupAddon align="inline-end">
              <UI.InputGroupText>{venue.length} result</UI.InputGroupText>
            </UI.InputGroupAddon>
          </UI.InputGroup>
          <DateFilter />
          <UI.ToggleGroup defaultValue={["all"]} aria-label="Status">
            <UI.ToggleGroupItem value="all">All</UI.ToggleGroupItem>
            <UI.ToggleGroupItem value="on-sale">On sale</UI.ToggleGroupItem>
            <UI.ToggleGroupItem value="draft">Draft</UI.ToggleGroupItem>
          </UI.ToggleGroup>
        </UI.PageFilter>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-6">
          <UI.DataList
            status={UI.DataListStatus.ready}
            variants={UI.DataListVariant.card}
            framed={false}
            columns={[{ id: "name", label: "Featured event", render: (item: (typeof venue)[number]) => item.name }]}
            rows={venue.slice(0, 1)}
            rowKey={(item) => item.id}
          />
          <EventTable onOpen={setOpen} />
          <UI.Pagination>
            <UI.PaginationContent>
              <UI.PaginationItem>
                <UI.PaginationPrevious href="#page-previous" onClick={stay} />
              </UI.PaginationItem>
              <UI.PaginationItem>
                <UI.PaginationLink href="#page-1" onClick={stay} isActive>
                  1
                </UI.PaginationLink>
              </UI.PaginationItem>
              <UI.PaginationItem>
                <UI.PaginationLink href="#page-2" onClick={stay}>
                  2
                </UI.PaginationLink>
              </UI.PaginationItem>
              <UI.PaginationItem>
                <UI.PaginationEllipsis />
              </UI.PaginationItem>
              <UI.PaginationItem>
                <UI.PaginationNext href="#page-next" onClick={stay} />
              </UI.PaginationItem>
            </UI.PaginationContent>
          </UI.Pagination>
          <UI.BridgeCalendar
            defaultDate={day(22)}
            events={event}
            holidays={[{ id: "holiday", title: "Public holiday", start: day(25), end: day(26) }]}
            labels={calendarLabel}
            onEventActivate={(item) => notify.info(`Open ${item.id}`)}
            onSlotSelect={(selection) => notify.info(`New slot ${selection.start.toLocaleString("en-GB")}`)}
          />
        </div>
      </UI.PageContent>
      <EventSheet id={open} onClose={() => setOpen(undefined)} />
    </UI.Page>
  )
}
