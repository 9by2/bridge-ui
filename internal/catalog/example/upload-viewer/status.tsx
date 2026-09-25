import { useRef, useState } from "react"

import { Button, UploadViewer, UploadViewerStatus } from "@bridge/ui"

const url = "/contract-preview.svg"

export default function Example() {
  const [status, setStatus] = useState<UploadViewerStatus>()
  const trigger = useRef<HTMLElement | null>(null)
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(UploadViewerStatus).map((next) => (
        <Button
          key={next}
          variant="outline"
          onClick={(event) => {
            trigger.current = event.currentTarget
            setStatus(next)
          }}>
          Preview {next}
        </Button>
      ))}
      <UploadViewer
        open={status !== undefined}
        onOpenChange={(open) => !open && setStatus(undefined)}
        finalFocus={trigger}
        status={status}
        statusLabel="Loading contract…"
        source={{
          name: "contract-preview.svg",
          type: "image/svg+xml",
          url: status === UploadViewerStatus.loading ? undefined : url,
          description: "The caller resolves the URL; the viewer never fetches it."
        }}
        closeLabel="Close preview"
        downloadLabel="Download"
        fallback="This file could not be displayed."
        action={
          <Button variant="secondary" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
            Open in new tab
          </Button>
        }
      />
    </div>
  )
}
