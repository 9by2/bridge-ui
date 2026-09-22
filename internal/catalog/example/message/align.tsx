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
    <Axis label="align">
      {(["start", "end"] as const).map((align) => (
        <UI.Message key={align} align={align}>
          <UI.MessageContent>
            <UI.Bubble align={align}>
              <UI.BubbleContent>{align}</UI.BubbleContent>
            </UI.Bubble>
          </UI.MessageContent>
        </UI.Message>
      ))}
    </Axis>
  )
}
