import type { ReactNode } from "react"

import * as UI from "@bridge/ui"

function Axis({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <section className="space-y-2">
      <UI.Heading as={UI.WAIHeading.H3} className="text-sm font-semibold">
        {label}
      </UI.Heading>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

export default function Example() {
  return (
    <Axis label="orientation">
      {(["vertical", "horizontal", "responsive"] as const).map((orientation) => (
        <UI.Field key={orientation} orientation={orientation}>
          <UI.FieldLabel htmlFor={`field-${orientation}`}>{orientation}</UI.FieldLabel>
          <UI.Input id={`field-${orientation}`} />
        </UI.Field>
      ))}
    </Axis>
  )
}
