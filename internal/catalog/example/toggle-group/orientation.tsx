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
    <Axis label="orientation">
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <UI.ToggleGroup key={orientation} orientation={orientation} defaultValue={["one"]}>
          <UI.ToggleGroupItem value="one">One</UI.ToggleGroupItem>
          <UI.ToggleGroupItem value="two">Two</UI.ToggleGroupItem>
        </UI.ToggleGroup>
      ))}
    </Axis>
  )
}
