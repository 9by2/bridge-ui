import * as stylex from "@stylexjs/stylex"
import { useEffect, useRef, useState } from "react"
import ReactCrop from "react-image-crop"
import type { ReactCropProps } from "react-image-crop"

import { Button } from "./button"
import { token } from "./token.stylex"

const style = stylex.create({
  crop: {
    display: "block",
    width: "100%",
    maxWidth: "100%",
    textAlign: "center",
    "--rc-border-color": token.foreground,
    "--rc-focus-color": token.ring
  },
  cropRoot: { maxWidth: "100%" },
  root: { width: "100%", display: "flex", flexDirection: "column", gap: 12 },
  canvas: { maxHeight: "50dvh", width: "100%", touchAction: "none", objectFit: "contain" },
  label: { display: "block" },
  input: { display: "block", width: "100%" },
  select: {
    marginLeft: 8,
    borderRadius: "var(--bridge-radius-4, 0.25em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    backgroundColor: token.background,
    color: token.foreground,
    padding: 8
  },
  actions: { display: "flex", gap: 8 },
  status: { margin: 0 }
})
export type ImageCropProps = ReactCropProps

export function ImageCrop(props: ImageCropProps) {
  return (
    <div data-slot="image-crop" {...stylex.props(style.crop)}>
      <ReactCrop
        {...props}
        className={[stylex.props(style.cropRoot).className, props.className].filter(Boolean).join(" ")}
      />
    </div>
  )
}

export function ImageCropEditor({
  file,
  onApply,
  copy
}: {
  file: File
  onApply: (file: File) => void | Promise<void>
  copy: {
    preview: string
    zoom: string
    horizontal: string
    vertical: string
    rotate: string
    ratio: string
    square: string
    original: string
    banner: string
    apply: string
    busy: string
    error: string
  }
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const [image, setImage] = useState<{ file: File; bitmap: ImageBitmap }>()
  const [zoom, setZoom] = useState(1)
  const [x, setX] = useState(0.5)
  const [y, setY] = useState(0.5)
  const [rotation, setRotation] = useState(0)
  const [ratio, setRatio] = useState("square")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  useEffect(() => {
    let disposed = false
    let bitmap: ImageBitmap | undefined
    setImage(undefined)
    setError(false)
    setZoom(1)
    setX(0.5)
    setY(0.5)
    setRotation(0)
    setRatio("square")
    createImageBitmap(file)
      .then((value) => {
        if (disposed) value.close()
        else {
          bitmap = value
          setImage({ file, bitmap: value })
        }
      })
      .catch(() => {
        if (!disposed) setError(true)
      })
    return () => {
      disposed = true
      bitmap?.close()
    }
  }, [file])
  const bitmap = image?.file === file ? image.bitmap : undefined
  const width = bitmap ? (rotation % 180 ? bitmap.height : bitmap.width) : 1
  const height = bitmap ? (rotation % 180 ? bitmap.width : bitmap.height) : 1
  const aspect = ratio === "original" ? width / height : ratio === "banner" ? 3 : 1
  useEffect(() => {
    const target = canvas.current
    if (!target || !bitmap) return
    const context = target.getContext("2d")
    if (!context) {
      setError(true)
      return
    }
    target.width = 768
    target.height = Math.max(1, Math.round(768 / aspect))
    const scale = Math.max(target.width / width, target.height / height) * zoom
    const left = -(width * scale - target.width) * x
    const top = -(height * scale - target.height) * y
    context.clearRect(0, 0, target.width, target.height)
    context.save()
    context.translate(left + (width * scale) / 2, top + (height * scale) / 2)
    context.rotate((rotation * Math.PI) / 180)
    context.drawImage(
      bitmap,
      (-bitmap.width * scale) / 2,
      (-bitmap.height * scale) / 2,
      bitmap.width * scale,
      bitmap.height * scale
    )
    context.restore()
  }, [bitmap, aspect, width, height, rotation, zoom, x, y])
  return (
    <div {...stylex.props(style.root)}>
      <canvas
        ref={canvas}
        role="img"
        aria-label={copy.preview}
        {...stylex.props(style.canvas)}
        style={{ aspectRatio: aspect }}
        onPointerDown={(event) => {
          if (busy) return
          drag.current = { x: event.clientX, y: event.clientY }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current || busy) return
          const previous = drag.current
          const bounds = event.currentTarget.getBoundingClientRect()
          setX((value) => Math.max(0, Math.min(1, value - (event.clientX - previous.x) / Math.max(1, bounds.width))))
          setY((value) => Math.max(0, Math.min(1, value - (event.clientY - previous.y) / Math.max(1, bounds.height))))
          drag.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
      />
      <label {...stylex.props(style.label)}>
        {copy.zoom}
        <input
          {...stylex.props(style.input)}
          type="range"
          min={1}
          max={4}
          step={0.01}
          value={zoom}
          disabled={busy}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>
      <label {...stylex.props(style.label)}>
        {copy.horizontal}
        <input
          {...stylex.props(style.input)}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={x}
          disabled={busy}
          onChange={(event) => setX(Number(event.target.value))}
        />
      </label>
      <label {...stylex.props(style.label)}>
        {copy.vertical}
        <input
          {...stylex.props(style.input)}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={y}
          disabled={busy}
          onChange={(event) => setY(Number(event.target.value))}
        />
      </label>
      <label {...stylex.props(style.label)}>
        {copy.ratio}
        <select
          {...stylex.props(style.select)}
          value={ratio}
          disabled={busy}
          onChange={(event) => setRatio(event.target.value)}>
          <option value="square">{copy.square}</option>
          <option value="original">{copy.original}</option>
          <option value="banner">{copy.banner}</option>
        </select>
      </label>
      <div {...stylex.props(style.actions)}>
        <Button variant="outline" disabled={busy} onClick={() => setRotation((value) => (value + 90) % 360)}>
          {copy.rotate}
        </Button>
        <Button
          disabled={!bitmap || busy || error}
          onClick={async () => {
            const target = canvas.current!
            setBusy(true)
            setError(false)
            try {
              const blob = await new Promise<Blob>((resolve, reject) =>
                target.toBlob(
                  (value) => (value ? resolve(value) : reject(new Error("Crop encoding failed"))),
                  "image/png"
                )
              )
              await onApply(new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-cropped.png`, { type: "image/png" }))
            } catch {
              setError(true)
            } finally {
              setBusy(false)
            }
          }}>
          {busy ? copy.busy : copy.apply}
        </Button>
      </div>
      <p role="status" {...stylex.props(style.status)}>
        {error ? copy.error : ""}
      </p>
    </div>
  )
}
