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

function Sample({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <div className="flex min-w-24 flex-col gap-1 rounded-lg border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export default function Example() {
  return (
    <Axis label="orientation">
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Sample key={orientation} label={orientation}>
          <UI.ButtonGroup orientation={orientation}>
            <UI.Button>One</UI.Button>
            <UI.Button>Two</UI.Button>
          </UI.ButtonGroup>
        </Sample>
      ))}
    </Axis>
  )
}
