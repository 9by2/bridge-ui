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
    <Axis label="orientation and variant">
      {(["horizontal", "vertical"] as const).flatMap((orientation) =>
        (["default", "line"] as const).map((variant) => (
          <UI.Tabs key={`${orientation}-${variant}`} defaultValue="one" orientation={orientation}>
            <UI.TabsList variant={variant}>
              <UI.TabsTrigger value="one">One</UI.TabsTrigger>
              <UI.TabsTrigger value="two">Two</UI.TabsTrigger>
            </UI.TabsList>
            <UI.TabsContent value="one">
              {orientation} {variant}
            </UI.TabsContent>
          </UI.Tabs>
        ))
      )}
    </Axis>
  )
}
