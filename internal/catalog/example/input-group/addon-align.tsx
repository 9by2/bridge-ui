import type { ReactNode } from "react"

import * as UI from "@bridge/ui"

function Axis({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <section className="space-y-2">
      <UI.Heading as={UI.WAIHeading.H3}>{label}</UI.Heading>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

export default function Example() {
  return (
    <Axis label="addon align">
      {(["inline-start", "inline-end", "block-start", "block-end"] as const).map((align) => (
        <div key={align} className="w-56">
          <UI.InputGroup>
            <UI.InputGroupAddon align={align}>{align}</UI.InputGroupAddon>
            <UI.InputGroupInput aria-label={align} />
          </UI.InputGroup>
        </div>
      ))}
    </Axis>
  )
}
