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

const labels = (
  <>
    <UI.SelectValue placeholder="Select role" />
  </>
)
const options = (
  <UI.SelectContent>
    <UI.SelectItem value="admin">Admin</UI.SelectItem>
    <UI.SelectItem value="member">Member</UI.SelectItem>
  </UI.SelectContent>
)

export default function Example() {
  return (
    <Axis label="size">
      {(["default", "sm"] as const).map((size) => (
        <UI.Select key={size}>
          <UI.SelectTrigger size={size} aria-label={`${size} select`}>
            {labels}
          </UI.SelectTrigger>
          {options}
        </UI.Select>
      ))}
    </Axis>
  )
}
