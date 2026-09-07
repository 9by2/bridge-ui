import { useRef, useState } from "react"

import { Button, UploadViewer } from "@bridge/ui"

export default function Example() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button ref={trigger} onClick={() => setOpen(true)}>
        Preview attachment
      </Button>
      <UploadViewer
        open={open}
        onOpenChange={setOpen}
        finalFocus={trigger}
        source={{
          name: "Readme.txt",
          type: "text/plain",
          url: "/attachment.txt",
          description: "Unsupported content falls back to metadata and download."
        }}
        closeLabel="Close preview"
        downloadLabel="Download"
        fallback="No inline preview for this file type."
      />
    </>
  )
}
