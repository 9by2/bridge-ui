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
    <Axis label="menu button">
      {(["default", "outline"] as const).flatMap((variant) =>
        (["default", "sm", "lg"] as const).map((size) => (
          <UI.SidebarProvider key={`${variant}-${size}`}>
            <UI.SidebarMenuButton variant={variant} size={size}>
              {variant} {size}
            </UI.SidebarMenuButton>
          </UI.SidebarProvider>
        ))
      )}
    </Axis>
  )
}
