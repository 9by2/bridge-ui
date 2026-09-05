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
    <Axis label="item variant">
      <UI.ContextMenu>
        <UI.ContextMenuTrigger className="rounded border p-6">Right click</UI.ContextMenuTrigger>
        <UI.ContextMenuContent>
          <UI.ContextMenuItem variant="default">Default</UI.ContextMenuItem>
          <UI.ContextMenuItem variant="destructive">Destructive</UI.ContextMenuItem>
        </UI.ContextMenuContent>
      </UI.ContextMenu>
    </Axis>
  )
}
