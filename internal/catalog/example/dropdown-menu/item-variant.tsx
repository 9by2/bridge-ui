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
    <Axis label="item variant">
      <UI.DropdownMenu modal>
        <UI.DropdownMenuTrigger render={<UI.Button />}>Menu</UI.DropdownMenuTrigger>
        <UI.DropdownMenuContent
          render={(props) => (
            <section aria-label="Menu action">
              <div {...props} />
            </section>
          )}>
          <UI.DropdownMenuItem variant="default">Default</UI.DropdownMenuItem>
          <UI.DropdownMenuItem variant="destructive">Destructive</UI.DropdownMenuItem>
        </UI.DropdownMenuContent>
      </UI.DropdownMenu>
    </Axis>
  )
}
