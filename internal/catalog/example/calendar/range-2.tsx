import { format } from "date-fns"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

import * as UI from "@bridge/ui"

export default function Example() {
  const [range, setRange] = useState<DateRange | undefined>({ from: new Date(2026, 8, 24), to: new Date(2026, 9, 6) })
  return (
    <div className="space-y-4">
      <UI.Calendar
        mode="range"
        numberOfMonths={2}
        defaultMonth={new Date(2026, 8, 1)}
        selected={range}
        onSelect={setRange}
        showOutsideDays={false}
      />
      <p role="status" aria-label="Selected range" className="text-sm">
        {range?.from
          ? `${format(range.from, "MMM d, yyyy")} - ${range.to ? format(range.to, "MMM d, yyyy") : "Choose an end date"}`
          : "Choose a start date"}
      </p>
      <UI.Button variant="outline" onClick={() => setRange(undefined)}>
        Clear range
      </UI.Button>
    </div>
  )
}
