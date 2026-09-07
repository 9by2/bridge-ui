import { useState } from "react"
import type { ComponentProps } from "react"

import { UploadPreview } from "@bridge/ui"

export default function Example() {
  const [message, setMessage] = useState("Static state demonstration; no upload request")
  const states: NonNullable<ComponentProps<typeof UploadPreview>["transfer"]>["state"][] = [
    "queued",
    "uploading",
    "success",
    "error",
    "cancelled"
  ]
  return (
    <div className="w-full max-w-xl space-y-3">
      {states.map((state) => (
        <UploadPreview
          key={state}
          name={`${state}.pdf`}
          type="application/pdf"
          transfer={{ state, label: state, progress: state === "uploading" ? 42 : undefined }}
          retryAction={{ label: "Retry", onClick: () => setMessage(`Retry callback: ${state}`) }}
          cancelAction={{ label: "Cancel", onClick: () => setMessage(`Cancel callback: ${state}`) }}
        />
      ))}
      <p role="status">{message}</p>
    </div>
  )
}
