import { TimeSelectComponent } from "@cue/web/app/component/global/time-select.component"
import { Calendar } from "@cue/web/app/component/shadcn/calendar"
import { Field, FieldDescription, FieldLabel } from "@cue/web/app/component/shadcn/field"
import { Input } from "@cue/web/app/component/shadcn/input"
import {
  AddOneHourToDateTimeLocalValue,
  DateInputValueToDate,
  DateToDateInputValue,
  SplitDateTimeLocalValue
} from "@cue/web/app/lib/date-time-value"
import { m } from "@cue/web/shared/i18n/runtime/messages.js"
import { useId, useMemo, useRef, useState } from "react"
import type { DateRange } from "react-day-picker"

export interface DateTimeRangeFieldComponentProps {
  /**
   * Grid placement for the enclosing Field. Only pass a column span when the parent
   * really is a multi-column grid — every host used to hide this field behind a
   * popover/dialog, where a `col-span-2` would invent a second column and strand
   * sibling rows at half width; now that the field always renders inline, the same
   * caution still applies to any single-column host.
   */
  readonly className?: string | undefined
  readonly endLabel?: string | undefined
  readonly endsDefaultValue?: string | undefined
  readonly endsName?: string
  readonly label: string
  readonly required?: boolean | undefined
  readonly startLabel?: string | undefined
  readonly startsDefaultValue?: string | undefined
  readonly startsName?: string
}

/**
 * A date range plus start/end time, always rendered as one expanded surface — no
 * trigger button, no nested popover. Callers that reveal this field behind their own
 * Popover/Dialog/inline-edit affordance already show a formatted summary before
 * editing starts (e.g. "Aug 1, 2026, 7:00 PM – 10:00 PM"), so this field never
 * duplicates that as a second, inner trigger.
 *
 * `numberOfMonths` stays at 1. A prior isolated Playwright/Chrome check (no click,
 * calendar mounted from the first paint) found no RSS growth and briefly cleared
 * `numberOfMonths={2}` for rollout — but wiring this component into the real
 * `StudioEditableValue` Popover (Overview) and `StudioEventSettingsEditSurface` Dialog
 * (Settings) and exercising the ACTUAL production interaction (click to open, THEN
 * the calendar mounts, inside a focus-trapping overlay) reproduced a severe, sustained
 * multi-GB memory/CPU blowup with `numberOfMonths={2}` that never settled within
 * several minutes of observation — in both Vitest/jsdom (`test/container/studio-event*`)
 * and, per the original report this known issue documents, real Chrome too. The same
 * shape mounted WITHOUT a focus-trapping overlay (the create-draft form; ticket-type
 * `InlineEditCard`) never reproduces it, at 1 or 2 months. Do not flip this back to 2
 * without a fresh, careful, real-app browser verification of the exact
 * click-to-open-inside-a-focus-trap interaction — not an isolated harness. See
 * `reference/known-issues/bun-vitest-worker-rss-leak.md`.
 *
 * `TimeSelectComponent` stays the time control — a native `<select>` of quarter-hour
 * options including `23:59`. Native `<input type="time">` is not an acceptable fallback
 * (it rejects `23:59` as a stepMismatch). The control must not be a floating Combobox:
 * opening one next to this calendar re-triggers the Base UI positioner runaway.
 */
export function DateTimeRangeFieldComponent({
  className,
  endLabel,
  endsDefaultValue = "",
  endsName = "endsAt",
  label,
  required,
  startLabel,
  startsDefaultValue = "",
  startsName = "startsAt"
}: DateTimeRangeFieldComponentProps) {
  const labelId = useId()
  const startSplit = SplitDateTimeLocalValue(startsDefaultValue)
  const endSplit = SplitDateTimeLocalValue(endsDefaultValue)

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = DateInputValueToDate(startSplit.date)
    if (!from) return undefined
    const to = DateInputValueToDate(endSplit.date)
    return { from, to: to ?? from }
  })
  const [startTime, setStartTime] = useState(startSplit.time)
  const [endTime, setEndTime] = useState(endSplit.time)
  const endTouched = useRef(Boolean(endsDefaultValue))

  // `Calendar` (react-day-picker) treats its month bounds as identity-compared props: a
  // fresh `new Date()` on every render re-syncs its internal month state, which schedules
  // another render, which mints another Date — an unbounded update loop that only shows up
  // once the event loop is free. Mint the bounds once per mount instead.
  const calendarStartMonth = useMemo(() => new Date(new Date().getFullYear() - 2, 0), [])
  const calendarEndMonth = useMemo(() => new Date(new Date().getFullYear() + 5, 11), [])
  const [calendarDefaultMonth] = useState(() => range?.from ?? new Date())

  const endDate = range?.to ?? range?.from
  const startsAt = range?.from && startTime ? `${DateToDateInputValue(range.from)}T${startTime}` : ""
  const endsAt = endDate && endTime ? `${DateToDateInputValue(endDate)}T${endTime}` : ""
  // A required date/time range is submitted through sr-only, unfocusable mirror inputs
  // below (tabIndex={-1}), so native `required` validation can block the form's submit
  // event silently — no browser bubble, because the invalid control can't be focused.
  // Gating on `range?.from` means this only fires once the user has actually picked a
  // date, matching the exact silent-failure case: a date range was picked but one or
  // both times were not, so the sr-only required mirrors below stay empty.
  const dateRangeIncomplete = Boolean(required) && Boolean(range?.from) && (!startTime || !endTime)

  function changeRange(nextRange: DateRange | undefined) {
    if (nextRange?.to && nextRange.from && nextRange.to.getTime() !== nextRange.from.getTime())
      endTouched.current = true
    setRange(nextRange)
  }

  function changeStartTime(nextTime: string) {
    setStartTime(nextTime)
    if (endTouched.current || !range?.from) return
    const bumped = AddOneHourToDateTimeLocalValue(`${DateToDateInputValue(range.from)}T${nextTime}`)
    const { date: bumpedDate, time: bumpedTime } = SplitDateTimeLocalValue(bumped)
    const nextEndDate = DateInputValueToDate(bumpedDate)
    if (nextEndDate) setRange({ from: range.from, to: nextEndDate })
    setEndTime(bumpedTime)
  }

  function changeEndTime(nextTime: string) {
    endTouched.current = true
    setEndTime(nextTime)
  }

  const resolvedStartLabel = startLabel ?? m.date_time_range_field_start_label()
  const resolvedEndLabel = endLabel ?? m.date_time_range_field_end_label()

  return (
    // `Field` already renders `role="group"`; naming it via `aria-labelledby` (instead
    // of leaving it unnamed) is what lets a page with more than one date-range field
    // open at once (e.g. a ticket type's sale window AND check-in window) be queried
    // unambiguously, in tests and in a screen reader alike — there is no trigger button
    // left to carry that name instead.
    <Field className={className} aria-labelledby={labelId}>
      <FieldLabel id={labelId}>{label}</FieldLabel>
      {/* `Field`'s vertical orientation applies `*:w-full` to its direct children (sized
          for plain inputs) — wrapping `Calendar` in a plain div keeps it one level below
          that selector so its own `w-fit` sizing isn't force-stretched to the field's full
          width, the way it never was back when `Calendar` was nested inside a Popover. */}
      <div>
        <Calendar
          mode="range"
          captionLayout="dropdown"
          numberOfMonths={1}
          selected={range}
          defaultMonth={calendarDefaultMonth}
          startMonth={calendarStartMonth}
          endMonth={calendarEndMonth}
          onSelect={changeRange}
          className="p-0"
        />
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <TimeSelectComponent
          ariaLabel={m.date_time_range_field_time_label({ label: resolvedStartLabel })}
          placeholder={resolvedStartLabel}
          value={startTime}
          required={required}
          onChange={changeStartTime}
        />
        <TimeSelectComponent
          ariaLabel={m.date_time_range_field_time_label({ label: resolvedEndLabel })}
          placeholder={resolvedEndLabel}
          value={endTime}
          required={required}
          onChange={changeEndTime}
        />
      </div>
      {dateRangeIncomplete ? (
        <FieldDescription role="alert" className="text-destructive-text">
          {m.date_time_range_field_date_range_incomplete()}
        </FieldDescription>
      ) : null}
      {/* Submits the picked value and, unlike a type="hidden" or readOnly input, still
          participates in the form's native required-field validation — a `readonly`
          attribute exempts an element from constraint validation entirely (per the
          WHATWG spec), and the TimeSelectComponents above are native selects outside the
          form's focusable tree when disabled/hidden mirrors are used, so their own
          `required` can't block submission the way a normal field's would. `onChange`
          is a no-op, not missing: nothing can focus this element (aria-hidden,
          tabIndex={-1}, sr-only) to trigger it — it exists only so `required` has an
          effect. */}
      <Input
        aria-hidden="true"
        className="sr-only"
        name={startsName}
        value={startsAt}
        onChange={() => {}}
        tabIndex={-1}
        required={required}
      />
      <Input
        aria-hidden="true"
        className="sr-only"
        name={endsName}
        value={endsAt}
        onChange={() => {}}
        tabIndex={-1}
        required={required}
      />
    </Field>
  )
}
