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
    <Axis label="state">
      {(["idle", "uploading", "processing", "error", "done"] as const).map((state) => (
        <UI.Attachment key={state} state={state}>
          <UI.AttachmentMedia>PDF</UI.AttachmentMedia>
          <UI.AttachmentContent>
            <UI.AttachmentTitle>{state}</UI.AttachmentTitle>
            <UI.AttachmentDescription style={state === "error" ? { color: "#991b1b" } : undefined}>
              document.pdf
            </UI.AttachmentDescription>
          </UI.AttachmentContent>
        </UI.Attachment>
      ))}
    </Axis>
  )
}
