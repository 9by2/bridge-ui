import { useEffect, useRef, useState } from "react"

import { UploadList, UploadViewer } from "@bridge/ui"
import type { UploadAttachment } from "@bridge/ui"

export default function Example() {
  const [items, setItems] = useState<UploadAttachment[]>([
    {
      id: "saved",
      name: "Existing attachment.txt",
      type: "text/plain",
      size: 20,
      url: "/attachment.txt",
      description: "Existing remote metadata; no File conversion"
    }
  ])
  const [selected, setSelected] = useState<UploadAttachment>()
  const [url, setUrl] = useState("")
  const trigger = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!selected) {
      setUrl("")
      return
    }
    if (!selected.file) {
      setUrl(selected.url)
      return
    }
    const next = URL.createObjectURL(selected.file)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [selected])
  return (
    <div className="w-full max-w-xl">
      <UploadList
        value={items}
        onValueChange={setItems}
        maxCount={4}
        maxTotalSize={10 * 1024 * 1024}
        maxSize={5 * 1024 * 1024}
        onPreview={(item) => {
          trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
          setSelected(item)
        }}
        copy={{
          choose: "Choose attachment",
          remove: (name) => `Remove ${name}`,
          preview: (name) => `Preview ${name}`,
          size: (size) => `${size} bytes`,
          rejected: (name) => `Rejected ${name}: check the file or total limit`,
          removed: (name) => `Removed ${name}`,
          selected: (count) => `Selected ${count}`
        }}>
        Select up to four files, 5 MB each, 10 MB total
      </UploadList>
      {selected && url && (
        <UploadViewer
          open
          onOpenChange={(open) => {
            if (!open) setSelected(undefined)
          }}
          source={{ name: selected.name, type: selected.type, url }}
          finalFocus={trigger}
          closeLabel="Close preview"
          downloadLabel="Download attachment"
          fallback="Preview unavailable? Download the attachment instead."
        />
      )}
    </div>
  )
}
