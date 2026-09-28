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
    <Axis label="side">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <UI.Sheet key={side}>
          <UI.SheetTrigger render={<UI.Button variant="outline" />}>{side}</UI.SheetTrigger>
          <UI.SheetContent side={side}>
            <UI.SheetHeader>
              <UI.SheetTitle>{side} sheet</UI.SheetTitle>
              <UI.SheetDescription>Side variant</UI.SheetDescription>
            </UI.SheetHeader>
          </UI.SheetContent>
        </UI.Sheet>
      ))}
    </Axis>
  )
}
