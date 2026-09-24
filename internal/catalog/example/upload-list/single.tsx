import { useState } from "react"

import * as UI from "@bridge/ui"
import type { UploadAttachment } from "@bridge/ui"

export default function Example() {
  const [items, setItems] = useState<UploadAttachment[]>([
    { id: "saved", name: "contract-v1.pdf", type: "application/pdf", size: 48_000, url: "/contract-v1.pdf" }
  ])
  const [reason, setReason] = useState("")
  return (
    <div className="grid w-full max-w-xl gap-3">
      <UI.UploadList
        value={items}
        multiple={false}
        onValueChange={(next, change) => {
          setItems(next)
          setReason(change.reason)
        }}
        validate={UI.uploadValidation.extension([".pdf"], { message: (file) => `${file.name}: PDF only` })}
        issueDisplay={UI.UploadIssueDisplay.inline}
        renderItem={(attachment, helper) => (
          <UI.Item variant="outline">
            <UI.ItemContent>
              <UI.ItemTitle>{attachment.name}</UI.ItemTitle>
              <UI.ItemDescription>Selecting another PDF replaces this document.</UI.ItemDescription>
            </UI.ItemContent>
            <UI.ItemActions>
              <UI.Button variant="outline" onClick={helper.remove}>
                Remove {attachment.name}
              </UI.Button>
            </UI.ItemActions>
          </UI.Item>
        )}
        copy={{
          choose: "Replace contract",
          remove: (name) => `Remove ${name}`,
          preview: (name) => `Preview ${name}`,
          size: (size) => `${size} bytes`,
          rejected: (name) => `Rejected ${name}`,
          removed: (name) => `Removed ${name}`,
          selected: (count) => `Selected ${count}`
        }}>
        Single PDF. A new selection replaces the current file.
      </UI.UploadList>
      <p className="text-xs text-muted-foreground">Last change reason: {reason || "none"}</p>
    </div>
  )
}
