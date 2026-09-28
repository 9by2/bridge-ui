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
    <Axis label="orientation and media">
      <UI.Attachment orientation="horizontal">
        <UI.AttachmentMedia variant="icon">PDF</UI.AttachmentMedia>
        <UI.AttachmentContent>horizontal icon</UI.AttachmentContent>
      </UI.Attachment>
      <UI.Attachment orientation="vertical">
        <UI.AttachmentMedia variant="image">
          <div className="size-full bg-muted" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>vertical image</UI.AttachmentContent>
      </UI.Attachment>
    </Axis>
  )
}
