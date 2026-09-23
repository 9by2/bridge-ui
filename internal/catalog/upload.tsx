import { UploadIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button, DropArea, UploadPreview } from "@bridge/ui"

export function UploadExample({
  mode
}: {
  mode: "inline" | "compact" | "media" | "file-list" | "avatar" | "document" | "transfer" | "crop"
}) {
  const [files, setFiles] = useState<File[]>([])
  const [message, setMessage] = useState("No file selected")
  const [url, setUrl] = useState("")
  const [zoom, setZoom] = useState(1)
  const [busy, setBusy] = useState(false)
  const image = ["media", "avatar", "crop"].includes(mode)
  const selected = files[0]
  useEffect(() => {
    if (!image || !selected) {
      setUrl("")
      return
    }
    const next = URL.createObjectURL(selected)
    setUrl(next)
    return () => URL.revokeObjectURL(next)
  }, [image, selected])

  async function onUpload(file: File) {
    setMessage(`Upload callback received ${file.name} (${file.size} bytes). Demo only; no network request.`)
  }

  async function cropAndUpload() {
    if (!selected) return
    setBusy(true)
    try {
      const bitmap = await createImageBitmap(selected)
      try {
        const canvas = document.createElement("canvas")
        canvas.width = canvas.height = 256
        const context = canvas.getContext("2d")
        if (!context) throw new Error("Canvas unavailable")
        const side = Math.min(bitmap.width, bitmap.height) / zoom
        context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256)
        const blob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Crop failed"))), "image/png")
        )
        await onUpload(new File([blob], "cropped.png", { type: "image/png" }))
      } finally {
        bitmap.close()
      }
    } catch {
      setMessage("Unable to crop this image. Choose another image.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full max-w-lg space-y-4">
      <DropArea
        label={image ? "Choose image" : "Choose attachment"}
        layout={mode === "inline" || mode === "compact" ? mode : "stacked"}
        disabled={busy}
        multiple={mode === "file-list"}
        maxSize={5 * 1024 * 1024}
        accept={
          image
            ? { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }
            : mode === "document"
              ? { "application/pdf": [".pdf"] }
              : undefined
        }
        onDrop={(accepted, rejected) => {
          if (rejected.length) {
            setMessage("File rejected. Check type and 5 MB limit.")
            return
          }
          setFiles(accepted)
          setZoom(1)
          setMessage(accepted.map((file) => file.name).join(", ") || "No file selected")
        }}>
        <UploadIcon aria-hidden="true" />
        <span>
          {mode === "avatar"
            ? "Choose profile photo"
            : mode === "document"
              ? "Choose PDF document"
              : mode === "compact"
                ? "Attach file"
                : "Drop here or browse"}
        </span>
        {mode !== "compact" && (
          <span className="text-sm text-muted-foreground">{image ? "PNG or JPEG" : "File selection"} · Up to 5 MB</span>
        )}
      </DropArea>
      {url && (
        <div
          className={
            mode === "avatar"
              ? "mx-auto size-32 overflow-hidden rounded-full"
              : "mx-auto size-64 max-w-full overflow-hidden rounded-lg"
          }>
          <img
            src={url}
            alt={selected?.name ?? "Selected file"}
            data-selected-preview=""
            className="size-full object-cover"
            style={{ transform: `scale(${mode === "crop" ? zoom : 1})` }}
          />
        </div>
      )}
      {mode === "crop" && selected && (
        <label className="block space-y-2">
          Crop zoom
          <input
            className="block w-full"
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            disabled={busy}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>
      )}
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`}>
            <UploadPreview
              name={file.name}
              type={file.type}
              description={`${file.size.toLocaleString()} bytes`}
              thumbnail={image && url ? { src: url, alt: `Preview of ${file.name}` } : undefined}
              disabled={busy}
              previewAction={
                image
                  ? {
                      label: `Preview ${file.name}`,
                      onClick: () =>
                        document
                          .querySelector<HTMLImageElement>("img[data-selected-preview]")
                          ?.scrollIntoView({ block: "center" })
                    }
                  : undefined
              }
              removeAction={{
                label: `Remove ${file.name}`,
                onClick: () => {
                  const next = files.filter((_, position) => position !== index)
                  setFiles(next)
                  setMessage(next.map((item) => item.name).join(", ") || "No file selected")
                }
              }}
            />
          </li>
        ))}
      </ul>
      {mode === "crop" && (
        <Button disabled={!selected || busy} onClick={cropAndUpload}>
          {busy ? "Cropping..." : "Crop and upload"}
        </Button>
      )}
      {mode === "transfer" && (
        <Button disabled={!selected} onClick={() => selected && onUpload(selected)}>
          Trigger upload callback
        </Button>
      )}
      {(mode === "crop" || mode === "transfer") && (
        <p className="text-sm text-muted-foreground">Demo callback only. Your application owns the upload request.</p>
      )}
      <p role="status" className="break-words">
        {message}
      </p>
    </div>
  )
}
