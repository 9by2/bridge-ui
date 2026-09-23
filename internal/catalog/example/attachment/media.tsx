import { FileIcon, ImageIcon, VideoIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <UI.Attachment>
        <UI.AttachmentMedia variant="icon">
          <ImageIcon aria-hidden="true" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>
          <UI.AttachmentTitle>landscape.png</UI.AttachmentTitle>
          <UI.AttachmentDescription>Image - 1.2 MB</UI.AttachmentDescription>
        </UI.AttachmentContent>
      </UI.Attachment>
      <UI.Attachment>
        <UI.AttachmentMedia variant="icon">
          <VideoIcon aria-hidden="true" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>
          <UI.AttachmentTitle>walkthrough.mp4</UI.AttachmentTitle>
          <UI.AttachmentDescription>Video - 8.6 MB</UI.AttachmentDescription>
        </UI.AttachmentContent>
      </UI.Attachment>
      <UI.Attachment>
        <UI.AttachmentMedia variant="icon">
          <FileIcon aria-hidden="true" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>
          <UI.AttachmentTitle>design-system.pdf</UI.AttachmentTitle>
          <UI.AttachmentDescription>File - 2.4 MB</UI.AttachmentDescription>
        </UI.AttachmentContent>
      </UI.Attachment>
    </div>
  )
}
