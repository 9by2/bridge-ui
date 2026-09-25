import { useState } from "react"

import * as UI from "@bridge/ui"

export default function Example() {
  const [log, setLog] = useState<string[]>([])
  return (
    <div className="grid w-full max-w-xl gap-3">
      <UI.DropArea
        label="Choose CMS media"
        accept={{ "image/*": [] }}
        onDrop={(accepted, rejected) =>
          setLog([
            ...accepted.map((file) => `Accepted ${file.name}`),
            ...rejected.map((item) => `Rejected ${item.file.name}`)
          ])
        }>
        <UI.Empty>
          <UI.EmptyHeader>
            <UI.EmptyTitle>Drop images here</UI.EmptyTitle>
            <UI.EmptyDescription>Raw files go to your onDrop. Your app uploads and maps them.</UI.EmptyDescription>
          </UI.EmptyHeader>
        </UI.Empty>
      </UI.DropArea>
      <p role="status" aria-atomic="true" className="text-sm">
        {log.join(". ")}
      </p>
    </div>
  )
}
