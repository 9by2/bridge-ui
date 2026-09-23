import * as stylex from "@stylexjs/stylex"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
import { useEffect, useRef, type ComponentProps } from "react"
import { DayPicker, getDefaultClassNames, type DayButton, type Locale } from "react-day-picker"

import { type Button, buttonVariants } from "./button"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    width: "fit-content",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: "var(--bridge-radius-12, 0.75em)",
    backgroundColor: {
      default: token.background,
      ':is([data-slot="card-content"] *, [data-slot="popover-content"] *)': "transparent"
    },
    padding: 16
  },
  months: {
    position: "relative",
    display: "flex",
    flexDirection: { default: "column", "@media (min-width: 768px)": "row" },
    gap: "2.5em"
  },
  month: { display: "flex", width: 252, flex: "0 0 252px", flexDirection: "column", gap: 12 },
  nav: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4
  },
  navButton: {
    width: 28,
    height: 28,
    padding: 4,
    userSelect: "none",
    opacity: { default: 1, ':is([aria-disabled="true"])': 0.5 }
  },
  caption: {
    display: "flex",
    height: 28,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 28,
    boxSizing: "border-box"
  },
  dropdowns: {
    display: "flex",
    height: 28,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500
  },
  dropdownRoot: { position: "relative", borderRadius: "var(--bridge-radius-8, 0.5em)" },
  dropdown: { position: "absolute", inset: 0, backgroundColor: token.background, opacity: 0 },
  captionLabel: { fontWeight: 600, userSelect: "none", fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px" },
  captionDropdown: { display: "flex", alignItems: "center", gap: 4, borderRadius: "var(--bridge-radius-8, 0.5em)" },
  grid: { width: 252, borderCollapse: "collapse", tableLayout: "fixed" },
  weekdays: { display: "flex" },
  weekday: {
    width: 36,
    flex: "0 0 36px",
    fontSize: "0.8rem",
    fontWeight: 400,
    color: token.mutedForeground,
    userSelect: "none"
  },
  week: { display: "flex", width: "100%" },
  weekHeader: { width: 28, userSelect: "none" },
  weekNumber: { fontSize: "0.8rem", color: token.mutedForeground, userSelect: "none" },
  day: {
    position: "relative",
    width: 36,
    height: 36,
    padding: 0,
    textAlign: "center",
    userSelect: "none"
  },
  rangeStart: {
    isolation: "isolate",
    backgroundImage: `linear-gradient(to right, transparent 50%, color-mix(in oklch, ${token.muted}, transparent 20%) 50%)`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 32px"
  },
  rangeEnd: {
    isolation: "isolate",
    backgroundImage: `linear-gradient(to right, color-mix(in oklch, ${token.muted}, transparent 20%) 50%, transparent 50%)`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 32px"
  },
  middle: {
    backgroundImage: `linear-gradient(color-mix(in oklch, ${token.muted}, transparent 20%), color-mix(in oklch, ${token.muted}, transparent 20%))`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 32px"
  },
  outside: { color: token.mutedForeground },
  disabled: { color: token.mutedForeground, opacity: 0.5 },
  hidden: { visibility: "hidden" },
  icon: { width: 16, height: 16 },
  rtl: { rotate: { default: "0deg", ":dir(rtl)": "180deg" } },
  weekCell: {
    display: "flex",
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  dayButton: {
    position: "relative",
    isolation: "isolate",
    zIndex: 1,
    display: "flex",
    boxSizing: "border-box",
    height: "2.5em",
    width: "2.5em",
    flexDirection: "column",
    gap: 4,
    borderWidth: 0,
    borderRadius: "var(--bridge-radius-6, 0.375em)",
    margin: "auto",
    padding: 4,
    lineHeight: 1,
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    fontWeight: 400,
    color: token.foreground,
    backgroundColor: { default: "transparent", ":hover": token.ghostHover },
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  selected: { backgroundColor: token.primary, color: token.primaryForeground, fontWeight: 600 },
  rangeMiddle: { borderRadius: 0, backgroundColor: "transparent", color: token.foreground },
  today: {
    color: { default: token.highlight },
    fontWeight: 600
  },
  selectedToday: {
    color: { default: token.highlightForeground }
  }
})
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: ComponentProps<typeof DayPicker> & { buttonVariant?: ComponentProps<typeof Button>["variant"] }) {
  const defaults = getDefaultClassNames()
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      locale={locale}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters
      }}
      classNames={{
        root: defaults.root,
        months: `${defaults.months} ${stylex.props(style.months).className}`,
        month: `${defaults.month} ${stylex.props(style.month).className}`,
        nav: `${defaults.nav} ${stylex.props(style.nav).className}`,
        button_previous: `${defaults.button_previous} ${buttonVariants({ variant: buttonVariant })} ${stylex.props(style.navButton).className}`,
        button_next: `${defaults.button_next} ${buttonVariants({ variant: buttonVariant })} ${stylex.props(style.navButton).className}`,
        month_caption: `${defaults.month_caption} ${stylex.props(style.caption).className}`,
        dropdowns: `${defaults.dropdowns} ${stylex.props(style.dropdowns).className}`,
        dropdown_root: `${defaults.dropdown_root} ${stylex.props(style.dropdownRoot).className}`,
        dropdown: `${defaults.dropdown} ${stylex.props(style.dropdown).className}`,
        caption_label: `${defaults.caption_label} ${stylex.props(style.captionLabel, captionLayout !== "label" && style.captionDropdown).className}`,
        month_grid: `${defaults.month_grid} ${stylex.props(style.grid).className}`,
        weekdays: `${defaults.weekdays} ${stylex.props(style.weekdays).className}`,
        weekday: `${defaults.weekday} ${stylex.props(style.weekday).className}`,
        week: `${defaults.week} ${stylex.props(style.week).className}`,
        week_number_header: `${defaults.week_number_header} ${stylex.props(style.weekHeader).className}`,
        week_number: `${defaults.week_number} ${stylex.props(style.weekNumber).className}`,
        day: `${defaults.day} ${stylex.props(style.day).className}`,
        range_start: `${defaults.range_start} ${stylex.props(style.rangeStart).className}`,
        range_middle: `${defaults.range_middle} ${stylex.props(style.middle).className}`,
        range_end: `${defaults.range_end} ${stylex.props(style.rangeEnd).className}`,
        today: defaults.today,
        outside: `${defaults.outside} ${stylex.props(style.outside).className}`,
        disabled: `${defaults.disabled} ${stylex.props(style.disabled).className}`,
        hidden: `${defaults.hidden} ${stylex.props(style.hidden).className}`,
        ...classNames
      }}
      components={{
        Root: ({ rootRef, ...rootProps }) => <div data-slot="calendar" ref={rootRef} {...rootProps} />,
        Chevron: ({ className: iconClass, orientation, ...iconProps }) => {
          const classes = [
            stylex.props(style.icon, orientation !== "down" && orientation !== "up" && style.rtl).className,
            iconClass
          ]
            .filter(Boolean)
            .join(" ")
          return orientation === "left" ? (
            <ChevronLeftIcon className={classes} {...iconProps} />
          ) : orientation === "right" ? (
            <ChevronRightIcon className={classes} {...iconProps} />
          ) : (
            <ChevronDownIcon className={classes} {...iconProps} />
          )
        },
        DayButton: (dayProps) => <CalendarDayButton locale={locale} {...dayProps} />,
        WeekNumber: ({ children, ...cellProps }) => (
          <td {...cellProps}>
            <div {...stylex.props(style.weekCell)}>{children}</div>
          </td>
        ),
        ...components
      }}
      {...props}
    />
  )
}
export function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused && (document.activeElement === document.body || document.activeElement === ref.current))
      ref.current?.focus()
  }, [modifiers.focused])
  return (
    <button
      ref={ref}
      data-day={`${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today || undefined}
      data-selected={modifiers.selected || undefined}
      {...props}
      className={[
        getDefaultClassNames().day,
        stylex.props(
          style.dayButton,
          modifiers.selected && style.selected,
          modifiers.today && style.today,
          modifiers.today && modifiers.selected && style.selectedToday,
          modifiers.range_middle && style.rangeMiddle
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
