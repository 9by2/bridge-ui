import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { cropCopy, PrototypeMedia, uploadCopy } from "@catalog-prototype/shared/support"
import { DiscIcon, FileTextIcon, UploadIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import * as UI from "@bridge/ui"

const track = [
  { no: 1, title: "เพลงรัก (Intro)", length: "1:12" },
  { no: 2, title: "Midnight Drive", length: "3:48" },
  { no: 3, title: "ฝนตกที่หน้าต่าง", length: "4:05" },
  { no: 4, title: "Neon Heart", length: "3:31" }
] as const

function useObjectUrl(file: File | undefined, fallback = "") {
  const [url, setUrl] = useState(fallback)
  useEffect(() => {
    if (!file) {
      setUrl(fallback)
      return
    }
    const next = URL.createObjectURL(file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [file, fallback])
  return url
}

function StatementUpload() {
  const [item, setItem] = useState<UI.UploadAttachment[]>([
    { id: "statement", name: "royalty-statement-aug.txt", type: "text/plain", size: 20, url: PrototypeMedia.ATTACHMENT }
  ])
  const [selected, setSelected] = useState<UI.UploadAttachment>()
  const trigger = useRef<HTMLElement | null>(null)
  const url = useObjectUrl(selected?.file, selected?.url ?? "")
  return (
    <>
      <UI.UploadList
        value={item}
        onValueChange={setItem}
        maxCount={4}
        maxSize={5 * 1024 * 1024}
        onPreview={(entry) => {
          trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
          setSelected(entry)
        }}
        copy={uploadCopy}>
        Drop royalty statement, up to 4 file, 5 MB each
      </UI.UploadList>
      {selected && url ? (
        <UI.UploadViewer
          open
          onOpenChange={(open) => (open ? undefined : setSelected(undefined))}
          source={{ name: selected.name, type: selected.type, url }}
          finalFocus={trigger}
          closeLabel="Close preview"
          downloadLabel="Download"
          fallback="No inline preview for this file type."
        />
      ) : null}
    </>
  )
}

function CoverArt() {
  const [file, setFile] = useState<File>()
  const [output, setOutput] = useState<File>()
  const url = useObjectUrl(output)
  return (
    <div className="grid grid-cols-1 gap-4">
      <UI.DropArea
        label="Choose cover art"
        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
        multiple={false}
        maxSize={5 * 1024 * 1024}
        onDrop={(accepted) => {
          setFile(accepted[0])
          setOutput(undefined)
        }}>
        <UploadIcon aria-hidden="true" />
        <span>Drop a square PNG or JPEG, or click to browse</span>
      </UI.DropArea>
      {file ? (
        <UI.ImageCropEditor
          key={`${file.name}-${file.lastModified}`}
          file={file}
          copy={cropCopy}
          onApply={(next) => {
            setOutput(next)
            notify.success("Cover cropped", next.name)
          }}
        />
      ) : null}
      {output ? (
        <UI.UploadPreview
          name={output.name}
          type={output.type}
          description={`${Math.ceil(output.size / 1024)} KB`}
          thumbnail={url ? { src: url, alt: "Cropped cover" } : undefined}
        />
      ) : (
        <UI.TicketCover>
          <UI.ResponsiveImage decorative src={PrototypeMedia.IMAGE} />
        </UI.TicketCover>
      )}
    </div>
  )
}

function Tracklist() {
  return (
    <UI.Accordion defaultValue={["track"]}>
      <UI.AccordionItem value="track">
        <UI.AccordionTrigger>Tracklist · {track.length} song</UI.AccordionTrigger>
        <UI.AccordionContent>
          <UI.List ordered>
            {track.map((item) => (
              <li key={item.no}>
                {item.title} <UI.InlineCode>{item.length}</UI.InlineCode>
              </li>
            ))}
          </UI.List>
        </UI.AccordionContent>
      </UI.AccordionItem>
      <UI.AccordionItem value="credit">
        <UI.AccordionTrigger>Credit</UI.AccordionTrigger>
        <UI.AccordionContent>
          <UI.Blockquote>Produced by Polycat. Mixed at Studio A, Bangkok.</UI.Blockquote>
        </UI.AccordionContent>
      </UI.AccordionItem>
    </UI.Accordion>
  )
}

function PastRelease() {
  return (
    <UI.Carousel>
      <UI.CarouselContent>
        {["Neon (2024)", "Sunday (2022)", "Party Crashers (2020)"].map((title) => (
          <UI.CarouselItem key={title}>
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>{title}</UI.CardTitle>
                <UI.CardDescription>Album</UI.CardDescription>
              </UI.CardHeader>
            </UI.Card>
          </UI.CarouselItem>
        ))}
      </UI.CarouselContent>
      <UI.CarouselPrevious aria-label="Previous release" />
      <UI.CarouselNext aria-label="Next release" />
    </UI.Carousel>
  )
}

export function ReleasePage() {
  usePageAction(<UI.Button onClick={() => notify.success("Release submitted for review")}>Submit release</UI.Button>)
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageEyebrow>Polycat</UI.PageEyebrow>
          <UI.PageTitle>New album: Midnight</UI.PageTitle>
          <UI.PageDescription>Upload cover art and royalty statement before distribution.</UI.PageDescription>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Cover art</UI.CardTitle>
              <UI.CardDescription>Crop locally; nothing is uploaded in this prototype.</UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <CoverArt />
            </UI.CardContent>
          </UI.Card>
          <div className="grid grid-cols-1 content-start gap-6">
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Royalty statement</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <StatementUpload />
              </UI.CardContent>
            </UI.Card>
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Distribution file</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.AttachmentGroup>
                  <UI.Attachment>
                    <UI.AttachmentMedia>
                      <DiscIcon aria-hidden="true" />
                    </UI.AttachmentMedia>
                    <UI.AttachmentContent>
                      <UI.AttachmentTitle>midnight-master.wav</UI.AttachmentTitle>
                      <UI.AttachmentDescription>412 MB</UI.AttachmentDescription>
                    </UI.AttachmentContent>
                  </UI.Attachment>
                  <UI.Attachment state="uploading">
                    <UI.AttachmentMedia>
                      <FileTextIcon aria-hidden="true" />
                    </UI.AttachmentMedia>
                    <UI.AttachmentContent>
                      <UI.AttachmentTitle>liner-notes.pdf</UI.AttachmentTitle>
                      <UI.AttachmentDescription>Uploading…</UI.AttachmentDescription>
                    </UI.AttachmentContent>
                  </UI.Attachment>
                </UI.AttachmentGroup>
              </UI.CardContent>
            </UI.Card>
            <Tracklist />
            <UI.Collapsible variant="line">
              <UI.CollapsibleTrigger showChevron>Past release</UI.CollapsibleTrigger>
              <UI.CollapsibleContent>
                <div className="px-12">
                  <PastRelease />
                </div>
              </UI.CollapsibleContent>
            </UI.Collapsible>
          </div>
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
