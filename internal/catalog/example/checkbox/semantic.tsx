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
    <Axis label="semantic">
      <UI.Checkbox aria-label="Unchecked" />
      <UI.Checkbox aria-label="Checked" defaultChecked />
      <UI.Checkbox aria-label="Disabled" disabled />
      <UI.Checkbox aria-label="Invalid" aria-invalid />
      <UI.Checkbox aria-label="Success" variant="success" defaultChecked />
    </Axis>
  )
}
