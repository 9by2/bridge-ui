import { FileIcon, ImageIcon, VideoIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <UI.Attachment>
        <UI.AttachmentMedia variant="icon">
          <ImageIcon role="img" aria-label="Image" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>
          <UI.AttachmentTitle>landscape.png</UI.AttachmentTitle>
          <UI.AttachmentDescription>Image - 1.2 MB</UI.AttachmentDescription>
        </UI.AttachmentContent>
      </UI.Attachment>
      <UI.Attachment>
        <UI.AttachmentMedia variant="icon">
          <VideoIcon role="img" aria-label="Video" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>
          <UI.AttachmentTitle>walkthrough.mp4</UI.AttachmentTitle>
          <UI.AttachmentDescription>Video - 8.6 MB</UI.AttachmentDescription>
        </UI.AttachmentContent>
      </UI.Attachment>
      <UI.Attachment>
        <UI.AttachmentMedia variant="icon">
          <FileIcon role="img" aria-label="File" />
        </UI.AttachmentMedia>
        <UI.AttachmentContent>
          <UI.AttachmentTitle>design-system.pdf</UI.AttachmentTitle>
          <UI.AttachmentDescription>File - 2.4 MB</UI.AttachmentDescription>
        </UI.AttachmentContent>
      </UI.Attachment>
    </div>
  )
}
