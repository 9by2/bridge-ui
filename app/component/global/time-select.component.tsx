import { cn } from "cnfast"

const TIME_STEP_MINUTES = 15
const MINUTES_PER_DAY = 24 * 60
const END_OF_DAY_OPTION = "23:59"

export const TimeOptions: readonly string[] = [
  ...Array.from({ length: MINUTES_PER_DAY / TIME_STEP_MINUTES }, (_, index) => {
    const totalMinutes = index * TIME_STEP_MINUTES
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0")
    const minutes = String(totalMinutes % 60).padStart(2, "0")
    return `${hours}:${minutes}`
  }),
  END_OF_DAY_OPTION
]

export interface TimeSelectComponentProps {
  readonly ariaLabel: string
  readonly className?: string | undefined
  readonly disabled?: boolean | undefined
  readonly id?: string | undefined
  readonly onChange: (value: string) => void
  readonly placeholder?: string | undefined
  readonly required?: boolean | undefined
  readonly value: string
}

/**
 * Quarter-hour time picker including an explicit `23:59` end-of-day option.
 *
 * Implemented as a native `<select>`, not Base UI Combobox: opening a Combobox
 * positioner next to a `Calendar` (or inside a focus-trapping Dialog/Popover) re-triggers
 * the floating-position runaway in `reference/known-issues/bun-vitest-worker-rss-leak.md`.
 * Native `<input type="time">` stays banned — `step={900}` rejects `23:59` as a
 * stepMismatch. A native `<select>` of the same option list keeps `23:59` without a
 * second floating layer.
 */
export function TimeSelectComponent({
  ariaLabel,
  className,
  disabled,
  id,
  onChange,
  placeholder = "Select time",
  required,
  value
}: TimeSelectComponentProps) {
  const options = value && !TimeOptions.includes(value) ? [...TimeOptions, value] : TimeOptions

  return (
    <select
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      value={value}
      required={required}
      disabled={disabled}
      onChange={(event) => onChange(event.currentTarget.value)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
