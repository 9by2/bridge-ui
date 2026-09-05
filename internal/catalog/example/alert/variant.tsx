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
    <Axis label="variant">
      {(["default", "destructive"] as const).map((variant) => (
        <Sample key={variant} label={variant}>
          <UI.Alert variant={variant}>
            <UI.AlertTitle>{variant}</UI.AlertTitle>
            <UI.AlertDescription>Variant alert</UI.AlertDescription>
          </UI.Alert>
        </Sample>
      ))}
    </Axis>
  )
}
