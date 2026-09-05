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
    <Axis label="semantic">
      <UI.Switch aria-label="Unchecked switch" />
      <UI.Switch aria-label="Checked switch" defaultChecked />
      <UI.Switch aria-label="Disabled switch" disabled />
      <UI.Switch aria-label="Invalid switch" aria-invalid />
    </Axis>
  )
}
