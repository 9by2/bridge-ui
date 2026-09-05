import type { ReactNode } from "react"

import * as UI from "@bridge/ui"

function Axis({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{label}</h3>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

export default function Example() {
  return (
    <Axis label="variant">
      {(["default", "separator", "border"] as const).map((variant) => (
        <UI.Marker key={variant} variant={variant}>
          <UI.MarkerContent>{variant}</UI.MarkerContent>
        </UI.Marker>
      ))}
    </Axis>
  )
}
