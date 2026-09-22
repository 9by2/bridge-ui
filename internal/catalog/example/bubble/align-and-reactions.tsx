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
    <Axis label="align and reactions">
      <UI.Bubble align="start">
        <UI.BubbleContent>start</UI.BubbleContent>
        <UI.BubbleReactions side="top" align="start">
          👍
        </UI.BubbleReactions>
      </UI.Bubble>
      <UI.Bubble align="end">
        <UI.BubbleContent>end</UI.BubbleContent>
        <UI.BubbleReactions side="bottom" align="end">
          ✓
        </UI.BubbleReactions>
      </UI.Bubble>
    </Axis>
  )
}
