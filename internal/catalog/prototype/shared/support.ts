import imageSrc from "@catalog-media/sean-sinclair-C_NJKfnTR5A-unsplash.jpg?url"

import type * as UI from "@bridge/ui"

export type ValueOf<T> = T[keyof T]

/** Local demo media only: the prototype never requests a remote asset. */
export const PrototypeMedia = { IMAGE: imageSrc, ATTACHMENT: "/attachment.txt" } as const

const pad = (value: number) => String(value).padStart(2, "0")

/** Caller-owned calendar copy. The package never ships product copy. */
export const calendarLabel: UI.BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view, date, week }) =>
    view === "week" && week
      ? `${week.start.toLocaleDateString("en-GB")} – ${week.end.toLocaleDateString("en-GB")}`
      : date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
  time: (hour, minute = 0) => `${pad(hour)}:${pad(minute)}`,
  currentTime: "Current time",
  scheduledEmpty: "Nothing scheduled in this period.",
  loadMore: "Loading more schedules",
  moreEvent: (count) => `+${count} more`
}

export const uploadCopy: UI.UploadListCopy = {
  choose: "Choose file",
  remove: (name) => `Remove ${name}`,
  preview: (name) => `Preview ${name}`,
  size: (size) => (size > 1024 * 1024 ? `${(size / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(size / 1024)} KB`),
  rejected: (name) => `Rejected ${name}: check type or size`,
  removed: (name) => `Removed ${name}`,
  selected: (count) => `Selected ${count} file`
}

export const cropCopy = {
  preview: "Crop preview",
  zoom: "Zoom",
  horizontal: "Horizontal position",
  vertical: "Vertical position",
  rotate: "Rotate 90 degrees",
  ratio: "Aspect ratio",
  square: "Square",
  original: "Original",
  banner: "Banner",
  apply: "Apply crop",
  busy: "Applying",
  error: "Unable to crop; choose another image"
} as const

export const day = (date: number, hour = 0, minute = 0) => new Date(2026, 8, date, hour, minute)

/** The catalog owns the URL hash; in-page links keep their semantics without navigating. */
export const stay = (event: { preventDefault: () => void }) => event.preventDefault()
