import { useState } from "react"

import * as UI from "@bridge/ui"
import type { UploadAttachment, UploadIssue } from "@bridge/ui"

const validate = UI.composeUploadValidation(
  UI.uploadValidation.default({
    accept: { "image/*": [] },
    maxFiles: 4,
    maxSize: 2 * 1024 * 1024,
    message: {
      [UI.UploadIssueCode.fileInvalidType]: (file) => `${file.name}: choose a PNG, JPEG or WebP image`,
      [UI.UploadIssueCode.fileTooLarge]: (_limit, file) => `${file?.name}: larger than 2 MB`,
      [UI.UploadIssueCode.tooManyFiles]: (limit, file) => `${file?.name}: up to ${limit} images`
    }
  })
)

export default function Example() {
  const [items, setItems] = useState<UploadAttachment[]>([])
  const [log, setLog] = useState<string[]>([])
  const record = (line: string) => setLog((value) => [line, ...value].slice(0, 4))
  return (
    <div className="grid w-full max-w-2xl gap-3">
      <UI.UploadList
        value={items}
        onValueChange={(next, change) => {
          setItems(next)
          record(`change: ${change.reason} ${change.attachment.map((item) => item.name).join(", ")}`)
        }}
        validate={validate}
        issueDisplay={UI.UploadIssueDisplay.inline}
        onIssue={(issue: UploadIssue[]) => record(`issue: ${issue.map((item) => item.code).join(", ")}`)}
        layout={UI.UploadListLayout.grid}
        renderEmpty={() => <p className="text-sm text-muted-foreground">No image selected yet.</p>}
        copy={{
          choose: "Choose image",
          remove: (name) => `Remove ${name}`,
          preview: (name) => `Preview ${name}`,
          size: (size) => `${Math.ceil(size / 1024)} KB`,
          rejected: (name) => `Rejected ${name}`,
          removed: (name) => `Removed ${name}`,
          selected: (count) => `Selected ${count}`
        }}>
        Up to four images, 2 MB each. Issues are shown inline; the app may also toast them.
      </UI.UploadList>
      <output aria-label="Upload event log" className="font-mono text-xs text-muted-foreground">
        {log.map((line, index) => (
          <div key={`${index}-${line}`}>{line}</div>
        ))}
      </output>
    </div>
  )
}
