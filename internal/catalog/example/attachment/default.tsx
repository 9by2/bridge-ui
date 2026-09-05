import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Attachment>
      <UI.AttachmentMedia>PDF</UI.AttachmentMedia>
      <UI.AttachmentContent>
        <UI.AttachmentTitle>design-system.pdf</UI.AttachmentTitle>
        <UI.AttachmentDescription>2.4 MB</UI.AttachmentDescription>
      </UI.AttachmentContent>
    </UI.Attachment>
  )
}
