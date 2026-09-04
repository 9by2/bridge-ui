import { Button } from "@bridge/ui/app/component/shadcn/button"
import { Calendar } from "@bridge/ui/app/component/shadcn/calendar"
import { Field, FieldLabel } from "@bridge/ui/app/component/shadcn/field"
import { Input } from "@bridge/ui/app/component/shadcn/input"
import { Popover, PopoverContent, PopoverTrigger } from "@bridge/ui/app/component/shadcn/popover"
import {
  DateInputValueToDate,
  DateToDateInputValue,
  FormatDateOnly as FormatDateOnlyValue,
  SplitDateTimeLocalValue
} from "@cue/web/app/lib/date-time-value"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { ChevronDownIcon } from "lucide-react"
import { useId, useState, type ChangeEvent } from "react"

export interface DateTimeFieldComponentProps {
  readonly defaultValue?: string | undefined
  readonly label: string
  readonly name: string
  readonly onChange?: ((value: string) => void) | undefined
  readonly required?: boolean | undefined
  readonly value?: string | undefined
}

export function DateTimeFieldComponent({
  defaultValue,
  label,
  name,
  onChange,
  required,
  value
}: DateTimeFieldComponentProps) {
  const id = useId()
  const [internalValue, setInternalValue] = useState(defaultValue ?? "")
  const currentValue = value === undefined ? internalValue : value
  const { date: dateValue, time: timeValue } = SplitDateTimeLocalValue(currentValue)
  const selectedDate = DateInputValueToDate(dateValue)
  const formValue = dateValue && timeValue ? `${dateValue}T${timeValue}` : ""

  function changeValue(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue)
    onChange?.(nextValue)
  }

  function changeDate(nextDate: string) {
    changeValue(nextDate ? `${nextDate}T${timeValue}` : "")
  }

  function changeTime(nextTime: string) {
    changeValue(dateValue && nextTime ? `${dateValue}T${nextTime}` : "")
  }

  function handleCalendarSelect(date: Date | undefined) {
    if (date) changeDate(DateToDateInputValue(date))
  }

  function handleDateInputChange(event: ChangeEvent<HTMLInputElement>) {
    changeDate(event.currentTarget.value)
  }

  function handleTimeInputChange(event: ChangeEvent<HTMLInputElement>) {
    changeTime(event.currentTarget.value)
  }

  return (
    <Field>
      <FieldLabel htmlFor={`${id}-time`}>{label}</FieldLabel>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
        <Popover>
          <PopoverTrigger render={<Button type="button" variant="outline" className="justify-between font-normal" />}>
            <span>{dateValue ? FormatDateOnly(dateValue) : m.date_time_field_pick_date()}</span>
            <ChevronDownIcon className="size-4 opacity-60" aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              {...(selectedDate ? { defaultMonth: selectedDate } : {})}
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
        <Input
          aria-label={m.date_time_field_time_aria_label({ label })}
          id={`${id}-time`}
          type="time"
          value={timeValue}
          required={required}
          onChange={handleTimeInputChange}
        />
      </div>
      <Input
        aria-label={m.date_time_field_date_aria_label({ label })}
        className="sr-only"
        type="date"
        value={dateValue}
        tabIndex={-1}
        onChange={handleDateInputChange}
      />
      <Input type="hidden" name={name} value={formValue} readOnly />
    </Field>
  )
}

function FormatDateOnly(value: string): string {
  return FormatDateOnlyValue(value, m.date_time_field_pick_date())
}
