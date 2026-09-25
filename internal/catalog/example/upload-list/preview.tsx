import { useState } from "react"

import * as UI from "@bridge/ui"
import type { UploadAttachment, UploadListPreview } from "@bridge/ui"

const copy = {
  choose: "Choose media",
  remove: (name: string) => `Remove ${name}`,
  preview: (name: string) => `Preview ${name}`,
  size: (size: number) => `${size} bytes`,
  rejected: (name: string) => `Rejected ${name}`,
  removed: (name: string) => `Removed ${name}`,
  selected: (count: number) => `Selected ${count}`
}

export default function Example() {
  const [items, setItems] = useState<UploadAttachment[]>([
    { id: "brief", name: "brief.pdf", type: "application/pdf", size: 48_000, url: "/brief.pdf" }
  ])
  const [preview, setPreview] = useState<UploadListPreview>(UI.UploadListPreview.row)
  return (
    <div className="grid w-full max-w-xl gap-3">
      <div role="group" aria-label="Preview" className="flex gap-2">
        {Object.values(UI.UploadListPreview).map((value) => (
          <UI.Button
            key={value}
            variant={preview === value ? "default" : "outline"}
            aria-pressed={preview === value}
            onClick={() => setPreview(value)}>
            {value}
          </UI.Button>
        ))}
      </div>
      <UI.UploadList value={items} onValueChange={setItems} preview={preview} copy={copy}>
        Drop media or choose files. Preview: {preview}.
      </UI.UploadList>
      <p className="text-xs text-muted-foreground">
        {items.length} attachment(s) in value{preview === UI.UploadListPreview.none ? " (items hidden)" : ""}.
      </p>
    </div>
  )
}
