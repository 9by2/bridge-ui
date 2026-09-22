import { useEffect, useState } from "react"

import { Button, DropArea, ImageCropEditor, UploadPreview } from "@bridge/ui"

export default function Example() {
  const [file, setFile] = useState<File>()
  const [output, setOutput] = useState<File>()
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("Apply a crop before triggering upload")
  useEffect(() => {
    if (!output) {
      setUrl("")
      return
    }
    const next = URL.createObjectURL(output)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [output])
  return (
    <div className="w-full max-w-lg space-y-3">
      <DropArea
        label="Choose image"
        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
        multiple={false}
        maxSize={5 * 1024 * 1024}
        onDrop={(files, rejected) => {
          if (rejected.length) {
            setMessage("Image rejected")
            return
          }
          setFile(files[0])
          setOutput(undefined)
        }}>
        Choose an image to crop
      </DropArea>
      {file && (
        <ImageCropEditor
          key={`${file.name}-${file.lastModified}`}
          file={file}
          onApply={(next) => {
            setOutput(next)
            setMessage(`Applied ${next.name}`)
          }}
          copy={{
            preview: "Crop preview",
            zoom: "Zoom",
            horizontal: "Horizontal position",
            vertical: "Vertical position",
            rotate: "Rotate 90 degrees",
            ratio: "Aspect ratio",
            square: "Square",
            original: "Original",
            banner: "Banner",
            apply: "Apply crop",
            busy: "Applying",
            error: "Unable to crop; choose another image"
          }}
        />
      )}
      {output && (
        <UploadPreview
          name={output.name}
          type={output.type}
          description={`${output.size} bytes`}
          thumbnail={url ? { src: url, alt: "Applied crop" } : undefined}
        />
      )}
      <Button
        disabled={!output}
        onClick={() => setMessage(`Upload callback received ${output?.name}. Demo only; no network request.`)}>
        Upload applied crop
      </Button>
      <p role="status">{message}</p>
    </div>
  )
}
