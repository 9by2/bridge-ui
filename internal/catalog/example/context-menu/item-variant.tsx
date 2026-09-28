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
    <Axis label="item variant">
      <UI.ContextMenu>
        <UI.ContextMenuTrigger>
          <div className="border p-6">Right click</div>
        </UI.ContextMenuTrigger>
        <UI.ContextMenuContent>
          <UI.ContextMenuItem variant="default">Default</UI.ContextMenuItem>
          <UI.ContextMenuItem variant="destructive">Destructive</UI.ContextMenuItem>
        </UI.ContextMenuContent>
      </UI.ContextMenu>
    </Axis>
  )
}
