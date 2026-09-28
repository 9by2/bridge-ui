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
    <Axis label="size">
      {(["default", "sm"] as const).map((size) => (
        <UI.AlertDialog key={size}>
          <UI.AlertDialogTrigger render={<UI.Button variant="outline" />}>{size}</UI.AlertDialogTrigger>
          <UI.AlertDialogContent size={size}>
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle>{size} dialog</UI.AlertDialogTitle>
              <UI.AlertDialogDescription>Size variant</UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Close</UI.AlertDialogCancel>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        </UI.AlertDialog>
      ))}
    </Axis>
  )
}
