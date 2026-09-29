import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { cropCopy, PrototypeMedia, uploadCopy } from "@catalog-prototype/shared/support"
import { FileArchiveIcon, FileIcon, ImageIcon, UploadIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import * as UI from "@bridge/ui"

const recent = [
  { name: "brand-guideline.pdf", type: "application/pdf", size: "4.2 MB" },
  { name: "onboarding-walkthrough.mp4", type: "video/mp4", size: "48 MB" },
  { name: "q3-board-deck.zip", type: "application/zip", size: "12 MB" }
] as const

function useObjectUrl(file: File | undefined) {
  const [url, setUrl] = useState("")
  useEffect(() => {
    if (!file) {
      setUrl("")
      return
    }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file])
  return url
}

function Library() {
  const [item, setItem] = useState<UI.UploadAttachment[]>([
    { id: "readme", name: "README.txt", type: "text/plain", size: 20, url: PrototypeMedia.ATTACHMENT }
  ])
  const [preview, setPreview] = useState<UI.UploadAttachment>()
  const trigger = useRef<HTMLElement | null>(null)
  const fileUrl = useObjectUrl(preview?.file)
  const url = preview?.url ?? fileUrl
  return (
    <>
      <UI.UploadList
        value={item}
        onValueChange={setItem}
        layout="grid"
        maxCount={6}
        maxSize={10 * 1024 * 1024}
        onPreview={(entry) => {
          trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
          setPreview(entry)
        }}
        copy={uploadCopy}>
        Drop file here, up to 6 file, 10 MB each
      </UI.UploadList>
      {preview && url ? (
        <UI.UploadViewer
          open
          onOpenChange={(open) => (open ? undefined : setPreview(undefined))}
          source={{ name: preview.name, type: preview.type, url }}
          finalFocus={trigger}
          closeLabel="Close preview"
          downloadLabel="Download"
          fallback="No inline preview for this file type."
        />
      ) : null}
    </>
  )
}

function Avatar() {
  const [file, setFile] = useState<File>()
  const [output, setOutput] = useState<File>()
  const url = useObjectUrl(output)
  return (
    <div className="grid grid-cols-1 gap-4">
      <UI.DropArea
        label="Choose avatar"
        layout="inline"
        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
        multiple={false}
        onDrop={(accepted) => {
          setFile(accepted[0])
          setOutput(undefined)
        }}>
        <ImageIcon aria-hidden="true" />
        <span>Choose a PNG or JPEG</span>
      </UI.DropArea>
      {file ? (
        <UI.ImageCropEditor key={`${file.name}-${file.lastModified}`} file={file} copy={cropCopy} onApply={setOutput} />
      ) : null}
      {output && url ? (
        <UI.UploadPreview name={output.name} type={output.type} thumbnail={{ src: url, alt: "New avatar" }} />
      ) : null}
    </div>
  )
}

export function FilePage() {
  const [message, setMessage] = useState("Select a file to preview")
  usePageAction(
    <UI.Button variant="outline" onClick={() => notify.info("Storage report sent")}>
      <UploadIcon aria-hidden="true" />
      Storage report
    </UI.Button>
  )
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>File</UI.PageTitle>
          <UI.PageDescription>6.4 GB of 10 GB used.</UI.PageDescription>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-8">
          <UI.Progress aria-label="Storage used" value={64}>
            <UI.ProgressLabel>Storage</UI.ProgressLabel>
            <UI.ProgressValue />
          </UI.Progress>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Library</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <Library />
              </UI.CardContent>
            </UI.Card>
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Workspace avatar</UI.CardTitle>
                <UI.CardDescription>Crop locally; no upload happens.</UI.CardDescription>
              </UI.CardHeader>
              <UI.CardContent>
                <Avatar />
              </UI.CardContent>
            </UI.Card>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <UI.Heading as={UI.WAIHeading.H2}>Recent</UI.Heading>
            {recent.map((item) => (
              <UI.UploadPreview
                key={item.name}
                name={item.name}
                type={item.type}
                description={item.size}
                previewAction={{ label: `Preview ${item.name}`, onClick: () => setMessage(`Preview ${item.name}`) }}
              />
            ))}
            <UI.Muted role="status">{message}</UI.Muted>
          </div>
          <UI.AttachmentGroup>
            <UI.Attachment>
              <UI.AttachmentMedia>
                <FileIcon aria-hidden="true" />
              </UI.AttachmentMedia>
              <UI.AttachmentContent>
                <UI.AttachmentTitle>security-review.pdf</UI.AttachmentTitle>
                <UI.AttachmentDescription>1.1 MB</UI.AttachmentDescription>
              </UI.AttachmentContent>
              <UI.AttachmentActions>
                <UI.AttachmentAction aria-label="Remove security-review.pdf">×</UI.AttachmentAction>
              </UI.AttachmentActions>
            </UI.Attachment>
            <UI.Attachment state="error">
              <UI.AttachmentMedia>
                <FileArchiveIcon aria-hidden="true" />
              </UI.AttachmentMedia>
              <UI.AttachmentContent>
                <UI.AttachmentTitle>export-2026-09.zip</UI.AttachmentTitle>
                <UI.AttachmentDescription>Upload failed</UI.AttachmentDescription>
              </UI.AttachmentContent>
            </UI.Attachment>
          </UI.AttachmentGroup>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UI.AspectRatio ratio={16 / 9}>
              <UI.ResponsiveImage alt="Office photo" src={PrototypeMedia.IMAGE} />
            </UI.AspectRatio>
            <UI.FractalGlass imageSrc={PrototypeMedia.IMAGE} label="Refracted office photo" />
          </div>
          <div className="px-12">
            <UI.Carousel>
              <UI.CarouselContent>
                {["Kick-off", "Offsite", "Launch party"].map((title) => (
                  <UI.CarouselItem key={title}>
                    <UI.TicketCover>
                      <UI.ResponsiveImage alt={title} src={PrototypeMedia.IMAGE} />
                    </UI.TicketCover>
                  </UI.CarouselItem>
                ))}
              </UI.CarouselContent>
              <UI.CarouselPrevious aria-label="Previous photo" />
              <UI.CarouselNext aria-label="Next photo" />
            </UI.Carousel>
          </div>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
