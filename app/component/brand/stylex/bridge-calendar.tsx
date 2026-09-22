import * as stylex from "@stylexjs/stylex"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode
} from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { themeToken, token } from "./token.stylex"

export const bridgeCalendarView = { scheduled: "scheduled", week: "week", month: "month" } as const
export const bridgeCalendarTone = {
  neutral: "neutral",
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger"
} as const

type ValueOf<T> = T[keyof T]

export type BridgeCalendarView = ValueOf<typeof bridgeCalendarView>
export type BridgeCalendarTone = ValueOf<typeof bridgeCalendarTone>
export type BridgeCalendarSlotSelection = { start: Date; end: Date }
export type BridgeCalendarPeriodContext = {
  view: BridgeCalendarView
  date: Date
  week?: { start: Date; end: Date }
}
export type BridgeCalendarEvent = {
  id: string
  title: ReactNode
  start: Date
  end: Date
  tone?: BridgeCalendarTone
  meta?: ReactNode
  icon?: ReactNode
  allDay?: boolean
  disabled?: boolean
}
export type BridgeCalendarHoliday = { id: string; title: ReactNode; start: Date; end: Date }
export type BridgeCalendarLabels = {
  previous: string
  next: string
  today: ReactNode
  view: Record<BridgeCalendarView, ReactNode>
  weekday: readonly ReactNode[]
  period: (context: BridgeCalendarPeriodContext) => ReactNode
  time: (hour: number, minute?: number) => ReactNode
  currentTime: string
  scheduledEmpty?: ReactNode
  loadMore?: ReactNode
  moreEvent: (count: number) => ReactNode
}
export type BridgeCalendarEventContext = { view: BridgeCalendarView; date: Date }
export type BridgeCalendarProps = {
  events: readonly BridgeCalendarEvent[]
  holidays?: readonly BridgeCalendarHoliday[]
  view?: BridgeCalendarView
  defaultView?: BridgeCalendarView
  date?: Date
  defaultDate?: Date
  labels: BridgeCalendarLabels
  action?: ReactNode
  renderEvent?: (event: BridgeCalendarEvent, context: BridgeCalendarEventContext) => ReactNode
  renderEmpty?: () => ReactNode
  onViewChange?: (view: BridgeCalendarView) => void
  onDateChange?: (date: Date) => void
  onEventActivate?: (event: BridgeCalendarEvent) => void
  onSlotSelect?: (selection: BridgeCalendarSlotSelection) => void
  onSlotDrop?: (selection: BridgeCalendarSlotSelection) => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const style = stylex.create({
  root: { display: "flex", width: "100%", minWidth: 0, flexDirection: "column", gap: 16, color: token.foreground },
  header: { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 },
  control: { display: "flex", alignItems: "center", gap: 4 },
  button: {
    display: "inline-flex",
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: 8,
    paddingInline: 10,
    backgroundColor: token.background,
    color: token.foreground,
    ":hover": { backgroundColor: token.muted },
    ":focus-visible": { outlineWidth: 2, outlineStyle: "solid", outlineColor: token.ring, outlineOffset: 2 }
  },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
    paddingBlock: 6,
    paddingInline: 8,
    backgroundColor: "transparent",
    color: token.mutedForeground
  },
  selectedTab: { borderBottomColor: token.primary, color: token.foreground },
  panel: {
    minHeight: 320,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: 10,
    overflow: "auto"
  },
  scheduled: { display: "flex", flexDirection: "column", gap: 16, padding: 16 },
  group: { display: "flex", flexDirection: "column", gap: 8 },
  date: { margin: 0, fontSize: 14, fontWeight: 600 },
  event: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    borderWidth: 0,
    borderLeftWidth: 4,
    borderLeftStyle: "solid",
    borderLeftColor: token.border,
    borderRadius: 4,
    padding: 10,
    backgroundColor: token.muted,
    color: token.foreground,
    textAlign: "start"
  },
  info: { borderLeftColor: token.ring },
  success: { borderLeftColor: token.primary },
  warning: { borderLeftColor: token.warning },
  danger: { borderLeftColor: token.destructive },
  meta: { color: token.foreground, fontSize: 12 },
  grid: { display: "grid", gridTemplateColumns: "repeat(7, minmax(7rem, 1fr))", minWidth: 700 },
  weekday: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    color: token.mutedForeground,
    fontSize: 12,
    textAlign: "center"
  },
  day: {
    display: "flex",
    minHeight: 104,
    flexDirection: "column",
    gap: 2,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderColor: token.border,
    padding: 6,
    backgroundColor: token.background,
    color: token.foreground,
    textAlign: "start"
  },
  outside: { color: token.mutedForeground, backgroundColor: token.muted },
  holiday: { backgroundColor: token.secondary },
  dayNumber: { fontSize: 12, fontWeight: 600 },
  holidayText: {
    overflow: "hidden",
    color: token.secondaryForeground,
    fontSize: 11,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  week: { minWidth: 952 },
  weekHeader: {
    display: "grid",
    gridTemplateColumns: "56px repeat(7, minmax(8rem, 1fr))",
    position: "sticky",
    top: 0,
    zIndex: 3,
    backgroundColor: token.background
  },
  weekHeaderSpacer: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderColor: themeToken.border
  },
  weekHeaderDay: {
    display: "flex",
    minHeight: 56,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderColor: themeToken.border
  },
  weekBody: { display: "grid", gridTemplateColumns: "56px repeat(7, minmax(8rem, 1fr))", position: "relative" },
  allDay: {
    display: "grid",
    gridTemplateColumns: "56px repeat(7, minmax(8rem, 1fr))",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: themeToken.border
  },
  allDaySpacer: { borderRightWidth: 1, borderRightStyle: "solid", borderRightColor: themeToken.border },
  allDayCell: {
    minHeight: 28,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: themeToken.border,
    padding: 2
  },
  timeRuler: { position: "relative", borderRightWidth: 1, borderRightStyle: "solid", borderColor: themeToken.border },
  timeLabel: {
    boxSizing: "border-box",
    height: 60,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: themeToken.border,
    paddingTop: 4,
    paddingRight: 8,
    color: token.mutedForeground,
    fontSize: 11,
    textAlign: "end"
  },
  weekDay: {
    boxSizing: "border-box",
    height: 1440,
    position: "relative",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderColor: themeToken.border,
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 59px, ${themeToken.border} 60px)`
  },
  weekHolidayHeader: { backgroundColor: themeToken.muted },
  weekHolidayDay: { backgroundColor: themeToken.muted },
  currentTime: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
    height: 2,
    backgroundColor: token.destructive,
    pointerEvents: "none"
  },
  currentTimeDot: {
    position: "absolute",
    left: -4,
    top: -3,
    width: 8,
    height: 8,
    borderRadius: token.shapePill,
    backgroundColor: token.destructive
  },
  selection: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.ring,
    backgroundColor: token.accent,
    opacity: 0.7,
    pointerEvents: "none"
  },
  weekEvent: { position: "absolute", left: 2, right: 2, zIndex: 2, overflow: "hidden" },
  monthEvent: {
    display: "flex",
    width: "100%",
    minWidth: 0,
    alignItems: "center",
    gap: 4,
    borderWidth: 0,
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: token.border,
    borderRadius: 3,
    paddingBlock: 2,
    paddingInline: 4,
    backgroundColor: token.muted,
    color: token.foreground,
    fontSize: 11,
    lineHeight: "14px",
    textAlign: "start",
    whiteSpace: "nowrap"
  },
  monthEventInfo: { borderLeftColor: token.ring },
  monthEventSuccess: { borderLeftColor: token.primary },
  monthEventWarning: { borderLeftColor: token.warning },
  monthEventDanger: { borderLeftColor: token.destructive },
  monthEventAllDay: {
    borderLeftWidth: 0,
    backgroundColor: token.foreground,
    color: token.background,
    fontWeight: 600
  },
  monthEventTime: { flexShrink: 0, color: token.mutedForeground, fontSize: 10, fontVariantNumeric: "tabular-nums" },
  monthEventTitle: { overflow: "hidden", textOverflow: "ellipsis" },
  empty: {
    display: "flex",
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    color: token.mutedForeground
  }
})

type CalendarContextValue = { view: BridgeCalendarView; date: Date }
const CalendarContext = createContext<CalendarContextValue | null>(null)
export function useBridgeCalendarContext() {
  const value = useContext(CalendarContext)
  if (!value) throw new Error("useBridgeCalendarContext must be used within BridgeCalendar")
  return value
}

function dayStart(value: Date) {
  const result = new Date(value)
  result.setHours(0, 0, 0, 0)
  return result
}
function addDay(value: Date, amount: number) {
  const result = new Date(value)
  result.setDate(result.getDate() + amount)
  return result
}
function addMonth(value: Date, amount: number) {
  const result = new Date(value)
  result.setMonth(result.getMonth() + amount)
  return result
}
function formatKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
}
function overlapsDay(start: Date, end: Date, day: Date) {
  const dayEnd = addDay(dayStart(day), 1)
  return start < dayEnd && end > dayStart(day)
}
function startOfWeek(value: Date, weekStartsOn: number) {
  return addDay(dayStart(value), -((dayStart(value).getDay() - weekStartsOn + 7) % 7))
}
function orderedWeekday(weekday: readonly ReactNode[], weekStartsOn: number) {
  return Array.from({ length: 7 }, (_, index) => weekday[(index + weekStartsOn) % 7])
}
function defaultSelection(day: Date): BridgeCalendarSlotSelection {
  const start = dayStart(day)
  start.setHours(9)
  return { start, end: new Date(start.getTime() + 3_600_000) }
}

function EventItem({
  event,
  context,
  onActivate,
  renderEvent
}: {
  event: BridgeCalendarEvent
  context: BridgeCalendarEventContext
  onActivate?: (event: BridgeCalendarEvent) => void
  renderEvent?: BridgeCalendarProps["renderEvent"]
}) {
  if (renderEvent) return <>{renderEvent(event, context)}</>
  return (
    <button
      type="button"
      disabled={event.disabled}
      aria-label={typeof event.title === "string" ? event.title : undefined}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation()
        onActivate?.(event)
      }}
      {...stylex.props(
        style.event,
        event.tone === "info" && style.info,
        event.tone === "success" && style.success,
        event.tone === "warning" && style.warning,
        event.tone === "danger" && style.danger
      )}>
      {event.icon}
      {event.title}
      {event.meta ? <span {...stylex.props(style.meta)}>{event.meta}</span> : null}
    </button>
  )
}

function MonthEventItem({
  event,
  context,
  labels,
  onActivate,
  renderEvent
}: {
  event: BridgeCalendarEvent
  context: BridgeCalendarEventContext
  labels: BridgeCalendarLabels
  onActivate?: (event: BridgeCalendarEvent) => void
  renderEvent?: BridgeCalendarProps["renderEvent"]
}) {
  if (renderEvent) return <>{renderEvent(event, context)}</>
  const time = labels.time(event.start.getHours(), event.start.getMinutes())
  return (
    <button
      type="button"
      disabled={event.disabled}
      aria-label={typeof event.title === "string" ? event.title : undefined}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation()
        onActivate?.(event)
      }}
      {...stylex.props(
        style.monthEvent,
        event.allDay && style.monthEventAllDay,
        event.tone === "info" && style.monthEventInfo,
        event.tone === "success" && style.monthEventSuccess,
        event.tone === "warning" && style.monthEventWarning,
        event.tone === "danger" && style.monthEventDanger
      )}>
      {event.allDay ? null : <span {...stylex.props(style.monthEventTime)}>{time}</span>}
      <span {...stylex.props(style.monthEventTitle)}>
        {event.allDay ? "[ALL DAY] " : null}
        {event.title}
      </span>
    </button>
  )
}

export function BridgeCalendar({
  events,
  holidays = [],
  view: controlledView,
  defaultView = "scheduled",
  date: controlledDate,
  defaultDate = new Date(),
  labels,
  action,
  renderEvent,
  renderEmpty,
  onViewChange,
  onDateChange,
  onEventActivate,
  onSlotSelect,
  onSlotDrop,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  weekStartsOn = 0,
  className
}: BridgeCalendarProps) {
  const [uncontrolledView, setUncontrolledView] = useState(defaultView)
  const [uncontrolledDate, setUncontrolledDate] = useState(defaultDate)
  const panelRef = useRef<HTMLDivElement>(null)
  const view = controlledView ?? uncontrolledView
  const date = controlledDate ?? uncontrolledDate
  const setView = (next: BridgeCalendarView) => {
    if (controlledView === undefined) setUncontrolledView(next)
    onViewChange?.(next)
  }
  const setDate = (next: Date) => {
    if (controlledDate === undefined) setUncontrolledDate(next)
    onDateChange?.(next)
  }
  const setViewFromKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const viewList = [bridgeCalendarView.scheduled, bridgeCalendarView.week, bridgeCalendarView.month]
    const currentIndex = viewList.indexOf(view)
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? viewList.length - 1
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % viewList.length
            : event.key === "ArrowLeft"
              ? (currentIndex - 1 + viewList.length) % viewList.length
              : -1
    if (nextIndex === -1) return
    event.preventDefault()
    const nextView = viewList[nextIndex]
    if (nextView) setView(nextView)
  }
  const move = (amount: number) =>
    setDate(
      view === "week" ? addDay(date, amount * 7) : view === "month" ? addMonth(date, amount) : addDay(date, amount)
    )
  const context = { view, date }
  const weekStart = startOfWeek(date, weekStartsOn)
  useEffect(() => {
    if (view !== "week" || !panelRef.current) return
    const now = new Date()
    panelRef.current.scrollTop = Math.max(0, now.getHours() * 60 + now.getMinutes() - 120)
  }, [view, date])
  const renderEventItem = (event: BridgeCalendarEvent) => (
    <EventItem key={event.id} event={event} context={context} onActivate={onEventActivate} renderEvent={renderEvent} />
  )
  const renderMonthEventItem = (event: BridgeCalendarEvent) => (
    <MonthEventItem
      key={event.id}
      event={event}
      context={context}
      labels={labels}
      onActivate={onEventActivate}
      renderEvent={renderEvent}
    />
  )
  const selected = (value: Date) => onSlotSelect?.(defaultSelection(value))
  const renderedView =
    view === "scheduled" ? (
      <ScheduledView
        date={date}
        events={events}
        labels={labels}
        renderEmpty={renderEmpty}
        renderEvent={renderEventItem}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
      />
    ) : view === "week" ? (
      <WeekView
        date={date}
        events={events}
        holidays={holidays}
        labels={labels}
        renderEvent={renderEventItem}
        onSlotSelect={onSlotSelect}
        weekStartsOn={weekStartsOn}
      />
    ) : (
      <MonthView
        date={date}
        events={events}
        holidays={holidays}
        labels={labels}
        renderEvent={renderMonthEventItem}
        onSlotSelect={selected}
        onSlotDrop={(next) => onSlotDrop?.(defaultSelection(next))}
        weekStartsOn={weekStartsOn}
      />
    )
  return (
    <CalendarContext.Provider value={context}>
      <Tabs
        value={view}
        onValueChange={(value) => {
          if (value === "scheduled" || value === "week" || value === "month") setView(value)
        }}>
        <section
          data-slot="bridge-calendar"
          className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
          <header {...stylex.props(style.header)}>
            <strong>
              {labels.period({
                view,
                date,
                week: view === "week" ? { start: weekStart, end: addDay(weekStart, 6) } : undefined
              })}
            </strong>
            <div {...stylex.props(style.control)}>
              <button
                type="button"
                aria-label={labels.previous}
                onClick={() => move(-1)}
                {...stylex.props(style.button)}>
                <ChevronLeftIcon size={16} />
              </button>
              <button type="button" onClick={() => setDate(new Date())} {...stylex.props(style.button)}>
                {labels.today}
              </button>
              <button type="button" aria-label={labels.next} onClick={() => move(1)} {...stylex.props(style.button)}>
                <ChevronRightIcon size={16} />
              </button>
            </div>
            <TabsList activateOnFocus aria-label="Calendar view" onKeyDown={setViewFromKey} variant="line">
              {Object.entries(labels.view).map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {action}
          </header>
          <TabsContent ref={panelRef} value={view} data-view={view} {...stylex.props(style.panel)}>
            {renderedView}
          </TabsContent>
        </section>
      </Tabs>
    </CalendarContext.Provider>
  )
}

function ScheduledView({
  date,
  events,
  labels,
  renderEmpty,
  renderEvent,
  hasMore,
  isLoadingMore,
  onLoadMore
}: {
  date: Date
  events: readonly BridgeCalendarEvent[]
  labels: BridgeCalendarLabels
  renderEmpty?: () => ReactNode
  renderEvent: (event: BridgeCalendarEvent) => ReactNode
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore?: () => void
}) {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!hasMore || isLoadingMore || !onLoadMore || !loadMoreRef.current || typeof IntersectionObserver === "undefined")
      return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) onLoadMore()
    })
    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])
  const days = Array.from({ length: 30 }, (_, index) => addDay(dayStart(date), index))
  const groups = days
    .map((day) => ({ day, events: events.filter((event) => overlapsDay(event.start, event.end, day)) }))
    .filter((group) => group.events.length > 0)
  if (groups.length === 0) return <div {...stylex.props(style.empty)}>{renderEmpty?.() ?? labels.scheduledEmpty}</div>
  return (
    <div {...stylex.props(style.scheduled)}>
      {groups.map((group) => (
        <section key={formatKey(group.day)} {...stylex.props(style.group)}>
          <h3 {...stylex.props(style.date)}>{formatKey(group.day)}</h3>
          {group.events.map(renderEvent)}
        </section>
      ))}
      {hasMore ? (
        <div ref={loadMoreRef}>
          <button type="button" disabled={isLoadingMore} onClick={onLoadMore} {...stylex.props(style.button)}>
            {isLoadingMore ? labels.loadMore : "Load more"}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function DaySlot({
  children,
  date,
  onDrop,
  onSelectDay,
  ...prop
}: {
  children: ReactNode
  date: Date
  onDrop?: (date: Date) => void
  onSelectDay: (date: Date) => void
} & Omit<ComponentProps<"div">, "onDrop" | "onSelect">) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelectDay(date)
    }
  }
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={formatKey(date)}
      onClick={() => onSelectDay(date)}
      onKeyDown={onKeyDown}
      onDragOver={onDrop ? (event) => event.preventDefault() : undefined}
      onDrop={onDrop ? () => onDrop(date) : undefined}
      {...prop}>
      {children}
    </div>
  )
}

const hour = Array.from({ length: 24 }, (_, index) => index)
const minuteInDay = 24 * 60

type WeekDrag = { day: Date; element: HTMLDivElement; minute: number }

function minuteAtPoint(event: MouseEvent, element: HTMLDivElement) {
  const rect = element.getBoundingClientRect()
  const top = Number.isFinite(rect.top) ? rect.top : 0
  const height = Number.isFinite(rect.height) && rect.height > 0 ? rect.height : minuteInDay
  const y = Number.isFinite(event.clientY) ? event.clientY : top
  const ratio = Math.max(0, Math.min(1, (y - top) / height))
  const minute = Math.round((ratio * minuteInDay) / 15) * 15
  return Number.isFinite(minute) ? minute : 0
}
function setTime(day: Date, minute: number) {
  const result = new Date(day.getFullYear(), day.getMonth(), day.getDate())
  result.setHours(Math.floor(minute / 60), minute % 60, 0, 0)
  return result
}
function isSameDay(left: Date, right: Date) {
  return formatKey(left) === formatKey(right)
}

function layoutWeekEvent(events: readonly BridgeCalendarEvent[], day: Date) {
  const dayStartTime = dayStart(day)
  const dayEndTime = addDay(dayStartTime, 1)
  const positioned = events
    .map((item) => ({
      item,
      start: Math.max(dayStartTime.getTime(), item.start.getTime()),
      end: Math.min(dayEndTime.getTime(), item.end.getTime())
    }))
    .sort((left, right) => left.start - right.start)
  const result: Array<{ item: BridgeCalendarEvent; left: number; width: number }> = []
  let index = 0
  while (index < positioned.length) {
    const first = positioned[index]
    if (!first) break
    const cluster = [first]
    let clusterEnd = first.end
    index += 1
    while (index < positioned.length) {
      const next = positioned[index]
      if (!next || next.start >= clusterEnd) break
      cluster.push(next)
      clusterEnd = Math.max(clusterEnd, next.end)
      index += 1
    }
    const columns: (typeof cluster)[] = []
    for (const item of cluster) {
      const column = columns.findIndex((candidate) => {
        const last = candidate.at(-1)
        return last !== undefined && last.end <= item.start
      })
      if (column === -1) columns.push([item])
      else {
        const target = columns[column]
        if (target) target.push(item)
      }
    }
    const width = 100 / columns.length
    columns.forEach((column, columnIndex) => {
      column.forEach(({ item }) => result.push({ item, left: columnIndex * width, width }))
    })
  }
  return result
}

function WeekView({
  date,
  events,
  holidays,
  labels,
  renderEvent,
  onSlotSelect,
  weekStartsOn
}: {
  date: Date
  events: readonly BridgeCalendarEvent[]
  holidays: readonly BridgeCalendarHoliday[]
  labels: BridgeCalendarLabels
  renderEvent: (event: BridgeCalendarEvent) => ReactNode
  onSlotSelect?: (selection: BridgeCalendarSlotSelection) => void
  weekStartsOn: number
}) {
  const start = startOfWeek(date, weekStartsOn)
  const weekday = orderedWeekday(labels.weekday, weekStartsOn)
  const [now, setNow] = useState(() => new Date())
  const [dragEnd, setDragEnd] = useState<number | null>(null)
  const dragRef = useRef<WeekDrag | null>(null)
  const dragEndRef = useRef<number | null>(null)
  const suppressClickRef = useRef(false)
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (!dragRef.current) return
      const minute = minuteAtPoint(event, dragRef.current.element)
      dragEndRef.current = minute
      setDragEnd(minute)
    }
    const onMouseUp = () => {
      const drag = dragRef.current
      if (!drag) return
      const end = dragEndRef.current ?? drag.minute
      const startMinute = Math.min(drag.minute, end)
      const endMinute = Math.max(drag.minute, end)
      onSlotSelect?.({
        start: setTime(drag.day, startMinute),
        end: setTime(drag.day, endMinute === startMinute ? startMinute + 60 : endMinute)
      })
      dragRef.current = null
      dragEndRef.current = null
      suppressClickRef.current = true
      setDragEnd(null)
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [onSlotSelect])
  return (
    <div {...stylex.props(style.week)}>
      <div {...stylex.props(style.weekHeader)}>
        <div {...stylex.props(style.weekHeaderSpacer)} />
        {Array.from({ length: 7 }, (_, index) => {
          const day = addDay(start, index)
          const holiday = holidays.filter((item) => overlapsDay(item.start, item.end, day))
          return (
            <div
              key={formatKey(day)}
              data-holiday={holiday.length > 0 || undefined}
              {...stylex.props(style.weekHeaderDay, holiday.length > 0 && style.weekHolidayHeader)}>
              <span {...stylex.props(style.dayNumber)}>{weekday[index]}</span>
              <span>{day.getDate()}</span>
              {holiday.map((item) => (
                <span key={item.id} {...stylex.props(style.holidayText)}>
                  {item.title}
                </span>
              ))}
            </div>
          )
        })}
      </div>
      <div data-slot="bridge-calendar-all-day" {...stylex.props(style.allDay)}>
        <div {...stylex.props(style.allDaySpacer)} />
        {Array.from({ length: 7 }, (_, index) => {
          const day = addDay(start, index)
          return (
            <div key={formatKey(day)} {...stylex.props(style.allDayCell)}>
              {events.filter((item) => item.allDay && overlapsDay(item.start, item.end, day)).map(renderEvent)}
            </div>
          )
        })}
      </div>
      <div {...stylex.props(style.weekBody)}>
        <div {...stylex.props(style.timeRuler)}>
          {hour.map((value) => (
            <div key={value} data-slot="bridge-calendar-time" {...stylex.props(style.timeLabel)}>
              {labels.time(value)}
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }, (_, index) => {
          const day = addDay(start, index)
          const holiday = holidays.filter((item) => overlapsDay(item.start, item.end, day))
          const dayEvent = events.filter((item) => !item.allDay && overlapsDay(item.start, item.end, day))
          const currentMinute = now.getHours() * 60 + now.getMinutes()
          const drag =
            dragRef.current?.day && isSameDay(dragRef.current.day, day) && dragEnd !== null
              ? { start: Math.min(dragRef.current.minute, dragEnd), end: Math.max(dragRef.current.minute, dragEnd) }
              : null
          return (
            <DaySlot
              key={formatKey(day)}
              date={day}
              onSelectDay={(value) => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false
                  return
                }
                onSlotSelect?.(defaultSelection(value))
              }}
              onMouseDown={(event) => {
                const target = event.target
                if (event.button !== 0 || (target instanceof HTMLElement && target.closest("button"))) return
                const element = event.currentTarget
                const minute = minuteAtPoint(event.nativeEvent, element)
                dragRef.current = { day, element, minute }
                dragEndRef.current = minute
                setDragEnd(minute)
              }}
              data-holiday={holiday.length > 0 || undefined}
              {...stylex.props(style.weekDay, holiday.length > 0 && style.weekHolidayDay)}>
              {isSameDay(day, now) ? (
                <div
                  aria-label={labels.currentTime}
                  data-minute={currentMinute}
                  style={{ top: currentMinute }}
                  {...stylex.props(style.currentTime)}>
                  <span {...stylex.props(style.currentTimeDot)} />
                </div>
              ) : null}
              {drag ? (
                <div
                  style={{ top: drag.start, height: Math.max(15, drag.end - drag.start) }}
                  {...stylex.props(style.selection)}
                />
              ) : null}
              {layoutWeekEvent(dayEvent, day).map(({ item, left, width }) => {
                const dayStartTime = dayStart(day)
                const dayEndTime = addDay(dayStartTime, 1)
                const eventStart = item.start > dayStartTime ? item.start : dayStartTime
                const eventEnd = item.end < dayEndTime ? item.end : dayEndTime
                const top = eventStart.getHours() * 60 + eventStart.getMinutes()
                const height = Math.max(15, (eventEnd.getTime() - eventStart.getTime()) / 60_000)
                return (
                  <div
                    key={item.id}
                    style={{ top, height, left: `${left}%`, width: `${width}%`, right: "auto" }}
                    {...stylex.props(style.weekEvent)}>
                    {renderEvent(item)}
                  </div>
                )
              })}
            </DaySlot>
          )
        })}
      </div>
    </div>
  )
}

function MonthView({
  date,
  events,
  holidays,
  labels,
  renderEvent,
  onSlotSelect,
  onSlotDrop,
  weekStartsOn
}: {
  date: Date
  events: readonly BridgeCalendarEvent[]
  holidays: readonly BridgeCalendarHoliday[]
  labels: BridgeCalendarLabels
  renderEvent: (event: BridgeCalendarEvent) => ReactNode
  onSlotSelect: (date: Date) => void
  onSlotDrop: (date: Date) => void
  weekStartsOn: number
}) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const start = startOfWeek(first, weekStartsOn)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const end = addDay(startOfWeek(last, weekStartsOn), 6)
  const days = Array.from({ length: Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1 }, (_, index) =>
    addDay(start, index)
  )
  return (
    <div {...stylex.props(style.grid)}>
      {orderedWeekday(labels.weekday, weekStartsOn).map((label, index) => (
        <div key={index} {...stylex.props(style.weekday)}>
          {label}
        </div>
      ))}
      {days.map((day) => {
        const dayEvents = events.filter((item) => overlapsDay(item.start, item.end, day))
        const dayHolidays = holidays.filter((item) => overlapsDay(item.start, item.end, day))
        const outside = day.getMonth() !== date.getMonth()
        return (
          <DaySlot
            key={formatKey(day)}
            date={day}
            onSelectDay={onSlotSelect}
            onDrop={onSlotDrop}
            {...stylex.props(style.day, outside && style.outside, dayHolidays.length > 0 && style.holiday)}>
            <span {...stylex.props(style.dayNumber)}>{day.getDate()}</span>
            {dayHolidays.map((item) => (
              <span key={item.id} {...stylex.props(style.holidayText)}>
                {item.title}
              </span>
            ))}
            {dayEvents.slice(0, 3).map(renderEvent)}
            {dayEvents.length > 3 ? (
              <span {...stylex.props(style.meta)}>{labels.moreEvent(dayEvents.length - 3)}</span>
            ) : null}
          </DaySlot>
        )
      })}
    </div>
  )
}
