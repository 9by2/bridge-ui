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
    <Axis label="size">
      {(["default", "sm"] as const).map((size) => (
        <UI.Card key={size} size={size} className="w-56">
          <UI.CardHeader>
            <UI.CardTitle>{size}</UI.CardTitle>
            <UI.CardDescription>Card size</UI.CardDescription>
          </UI.CardHeader>
        </UI.Card>
      ))}
    </Axis>
  )
}
