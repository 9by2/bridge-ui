import * as stylex from "@stylexjs/stylex"
import { useRef, useState, type ComponentProps, type ReactNode } from "react"
import type { DropzoneOptions, FileRejection } from "react-dropzone"

import { DropArea } from "./drop-area"
import { UploadPreview } from "./upload-preview"

export type UploadRejection = { file: File; errors: FileRejection["errors"] }
export type UploadAttachment = {
  id: string
  name: string
  type: string
  size: number
  description?: string
  thumbnail?: { src: string; alt: string }
  transfer?: ComponentProps<typeof UploadPreview>["transfer"]
} & ({ file: File; url?: never } | { url: string; file?: never })
const style = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 12 },
  list: { display: "flex", flexDirection: "column", gap: 8, listStyleType: "none", padding: 0, margin: 0 },
  message: { margin: 0 }
})
export function UploadList({
  value,
  onValueChange,
  onPreview,
  onReject,
  onRetry,
  onCancel,
  maxCount = Infinity,
  maxTotalSize = Infinity,
  disabled,
  accept,
  maxSize,
  copy,
  children
}: {
  value: UploadAttachment[]
  onValueChange: (value: UploadAttachment[]) => void
  onPreview?: (attachment: UploadAttachment) => void
  onReject?: (rejections: UploadRejection[]) => void
  onRetry?: (attachment: UploadAttachment) => void
  onCancel?: (attachment: UploadAttachment) => void
  maxCount?: number
  maxTotalSize?: number
  disabled?: boolean
  accept?: DropzoneOptions["accept"]
  maxSize?: number
  children: ReactNode
  copy: {
    choose: string
    remove: (name: string) => string
    preview: (name: string) => string
    size: (size: number) => string
    rejected: (name: string) => string
    removed: (name: string) => string
    selected: (count: number) => string
    retry?: string
    cancel?: string
  }
}) {
  const root = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState("")
  return (
    <div ref={root} {...stylex.props(style.root)}>
      <DropArea
        label={copy.choose}
        disabled={disabled}
        accept={accept}
        maxSize={maxSize}
        onDrop={(files, rejections) => {
          const next = [...value]
          let size = value.reduce((total, item) => total + item.size, 0)
          const rejected: UploadRejection[] = [...rejections]
          for (const file of files) {
            const code =
              next.length >= maxCount
                ? "too-many-files"
                : size + file.size > maxTotalSize
                  ? "total-size-exceeded"
                  : undefined
            if (code) rejected.push({ file, errors: [{ code, message: copy.rejected(file.name) }] })
            else {
              next.push({ id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, file })
              size += file.size
            }
          }
          if (next.length !== value.length) onValueChange(next)
          if (rejected.length) onReject?.(rejected)
          setMessage(
            [copy.selected(next.length - value.length), ...rejected.map((item) => copy.rejected(item.file.name))].join(
              ". "
            )
          )
        }}>
        {children}
      </DropArea>
      <ul {...stylex.props(style.list)}>
        {value.map((item) => (
          <li key={item.id}>
            <UploadPreview
              name={item.name}
              type={item.type}
              description={item.description ?? copy.size(item.size)}
              thumbnail={item.thumbnail}
              transfer={item.transfer}
              disabled={disabled}
              previewAction={onPreview ? { label: copy.preview(item.name), onClick: () => onPreview(item) } : undefined}
              retryAction={onRetry && copy.retry ? { label: copy.retry, onClick: () => onRetry(item) } : undefined}
              cancelAction={onCancel && copy.cancel ? { label: copy.cancel, onClick: () => onCancel(item) } : undefined}
              removeAction={{
                label: copy.remove(item.name),
                onClick: () => {
                  onValueChange(value.filter((entry) => entry.id !== item.id))
                  setMessage(copy.removed(item.name))
                  root.current?.querySelector<HTMLElement>('[data-slot="drop-area"]')?.focus()
                }
              }}
            />
          </li>
        ))}
      </ul>
      <p role="status" aria-atomic="true" {...stylex.props(style.message)}>
        {message}
      </p>
    </div>
  )
}
