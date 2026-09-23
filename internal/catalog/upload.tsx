import { UploadIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button, DropArea, UploadPreview } from "@bridge/ui"

type UploadMode = "inline" | "compact" | "media" | "file-list" | "avatar" | "document" | "transfer" | "crop"

function dropAreaCopy(mode: UploadMode) {
  const label =
    mode === "avatar"
      ? "Choose profile photo"
      : mode === "document"
        ? "Choose PDF document"
        : mode === "compact"
          ? "Attach file"
          : "Drop here or browse"
  return { label }
}

function dropAreaAccept(mode: UploadMode, image: boolean): Record<string, string[]> | undefined {
  if (image) return { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }
  if (mode === "document") return { "application/pdf": [".pdf"] }
  return undefined
}

function SelectedFilePreview({
  url,
  mode,
  selectedName,
  zoom
}: {
  url: string
  mode: UploadMode
  selectedName?: string
  zoom: number
}) {
  if (!url) return null
  const frameClassName =
    mode === "avatar"
      ? "mx-auto size-32 overflow-hidden rounded-full"
      : "mx-auto size-64 max-w-full overflow-hidden rounded-lg"
  return (
    <div className={frameClassName}>
      <img
        src={url}
        alt={selectedName ?? "Selected file"}
        data-selected-preview=""
        className="size-full object-cover"
        style={{ transform: `scale(${mode === "crop" ? zoom : 1})` }}
      />
    </div>
  )
}

function CropZoomControl({
  mode,
  selected,
  zoom,
  busy,
  onZoomChange
}: {
  mode: UploadMode
  selected?: File
  zoom: number
  busy: boolean
  onZoomChange: (value: number) => void
}) {
  if (mode !== "crop" || !selected) return null
  return (
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
        onChange={(event) => onZoomChange(Number(event.target.value))}
      />
    </label>
  )
}

function UploadDemoActions({
  mode,
  selected,
  busy,
  onCrop,
  onTransfer
}: {
  mode: UploadMode
  selected?: File
  busy: boolean
  onCrop: () => void
  onTransfer: (file: File) => void
}) {
  if (mode !== "crop" && mode !== "transfer") return null
  return (
    <>
      {mode === "crop" && (
        <Button disabled={!selected || busy} onClick={onCrop}>
          {busy ? "Cropping..." : "Crop and upload"}
        </Button>
      )}
      {mode === "transfer" && (
        <Button disabled={!selected} onClick={() => selected && onTransfer(selected)}>
          Trigger upload callback
        </Button>
      )}
      <p className="text-sm text-muted-foreground">Demo callback only. Your application owns the upload request.</p>
    </>
  )
}

async function cropSquareToPngBlob(file: File, zoom: number) {
  const bitmap = await createImageBitmap(file)
  try {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 256
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Canvas unavailable")
    const side = Math.min(bitmap.width, bitmap.height) / zoom
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error("Crop failed"))), "image/png")
    )
  } finally {
    bitmap.close()
  }
}

type SelectedFile = { id: string; file: File }

function UploadFileList({
  files,
  image,
  url,
  busy,
  onRemove
}: {
  files: SelectedFile[]
  image: boolean
  url: string
  busy: boolean
  onRemove: (id: string) => void
}) {
  return (
    <ul className="space-y-2">
      {files.map(({ id, file }) => (
        <li key={id}>
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
            removeAction={{ label: `Remove ${file.name}`, onClick: () => onRemove(id) }}
          />
        </li>
      ))}
    </ul>
  )
}

export function UploadExample({ mode }: { mode: UploadMode }) {
  const [files, setFiles] = useState<SelectedFile[]>([])
  const [message, setMessage] = useState("No file selected")
  const [url, setUrl] = useState("")
  const [zoom, setZoom] = useState(1)
  const [busy, setBusy] = useState(false)
  const image = ["media", "avatar", "crop"].includes(mode)
  const selected = files[0]?.file
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
      const blob = await cropSquareToPngBlob(selected, zoom)
      await onUpload(new File([blob], "cropped.png", { type: "image/png" }))
    } catch {
      setMessage("Unable to crop this image. Choose another image.")
    } finally {
      setBusy(false)
    }
  }

  function removeFile(id: string) {
    const next = files.filter((item) => item.id !== id)
    setFiles(next)
    setMessage(next.map((item) => item.file.name).join(", ") || "No file selected")
  }

  const copy = dropAreaCopy(mode)
  return (
    <div className="w-full max-w-lg space-y-4">
      <DropArea
        label={image ? "Choose image" : "Choose attachment"}
        layout={mode === "inline" || mode === "compact" ? mode : "stacked"}
        disabled={busy}
        multiple={mode === "file-list"}
        maxSize={5 * 1024 * 1024}
        accept={dropAreaAccept(mode, image)}
        onDrop={(accepted, rejected) => {
          if (rejected.length) {
            setMessage("File rejected. Check type and 5 MB limit.")
            return
          }
          const next = accepted.map((file) => ({ id: crypto.randomUUID(), file }))
          setFiles(next)
          setZoom(1)
          setMessage(accepted.map((file) => file.name).join(", ") || "No file selected")
        }}>
        <UploadIcon aria-hidden="true" />
        <span>{copy.label}</span>
        {mode !== "compact" && (
          <span className="text-sm text-muted-foreground">{image ? "PNG or JPEG" : "File selection"} · Up to 5 MB</span>
        )}
      </DropArea>
      <SelectedFilePreview url={url} mode={mode} selectedName={selected?.name} zoom={zoom} />
      <CropZoomControl mode={mode} selected={selected} zoom={zoom} busy={busy} onZoomChange={setZoom} />
      <UploadFileList files={files} image={image} url={url} busy={busy} onRemove={removeFile} />
      <UploadDemoActions mode={mode} selected={selected} busy={busy} onCrop={cropAndUpload} onTransfer={onUpload} />
      <p role="status" className="break-words">
        {message}
      </p>
    </div>
  )
}
