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
      {(["default", "outline", "muted"] as const).map((variant) => (
        <UI.Item key={variant} variant={variant} className="w-56">
          <UI.ItemContent>
            <UI.ItemTitle>{variant}</UI.ItemTitle>
          </UI.ItemContent>
        </UI.Item>
      ))}
    </Axis>
  )
}
