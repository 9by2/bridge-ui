import { UploadIcon } from "lucide-react"
import { useState } from "react"

import { DropArea } from "@bridge/ui"

export default function Example() {
  const [message, setMessage] = useState("No file selected")
  return (
    <div className="w-full max-w-lg space-y-3">
      <DropArea
        label="Choose a file"
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        onDrop={(files, rejections) =>
          setMessage(
            rejections.length ? "File rejected. Choose one file under 5 MB." : files.map((file) => file.name).join(", ")
          )
        }>
        <UploadIcon aria-hidden="true" />
        <span>Drop a file here or click to browse</span>
        <span className="text-sm text-muted-foreground">One file, up to 5 MB</span>
      </DropArea>
      <p role="status">{message}</p>
    </div>
  )
}
