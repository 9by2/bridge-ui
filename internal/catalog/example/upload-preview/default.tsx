import { useState } from "react"

import { UploadPreview } from "@bridge/ui"

export default function Example() {
  const [message, setMessage] = useState("Choose a preview action")
  return (
    <div className="w-full max-w-lg space-y-3">
      {[
        { name: "Landscape.png", type: "image/png" },
        { name: "Walkthrough.mp4", type: "video/mp4" },
        { name: "Recording.mp3", type: "audio/mpeg" },
        { name: "Proposal.pdf", type: "application/pdf" },
        { name: "Archive.zip", type: "application/zip" }
      ].map((file) => (
        <UploadPreview
          key={file.name}
          name={file.name}
          type={file.type}
          description="Type-specific icon and caller-owned preview action"
          previewAction={{ label: `Preview ${file.name}`, onClick: () => setMessage(`Preview callback: ${file.name}`) }}
        />
      ))}
      <p role="status">{message}</p>
    </div>
  )
}
