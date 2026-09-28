import * as stylex from "@stylexjs/stylex"
import { EyeIcon, FileIcon, FileTextIcon, ImageIcon, MusicIcon, VideoIcon, XIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "./button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./item"
import { token } from "./token.stylex"

const style = stylex.create({
  icon: { width: 16, height: 16 },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  content: { minWidth: 0 },
  title: { WebkitLineClamp: "unset", wordBreak: "break-all" },
  progress: { width: "100%" },
  tile: { flexDirection: "column", alignItems: "stretch", height: "100%" },
  tileMedia: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    aspectRatio: "1",
    overflow: "hidden",
    borderRadius: "var(--bridge-radius-6, 6px)",
    color: token.mutedForeground,
    backgroundColor: token.muted
  },
  tileIcon: { width: 24, height: 24 }
})

type ValueOf<T> = T[keyof T]

/** `row` is the default list row; `tile` stacks square media above content for grid layout. */
export const UploadPreviewVariant = { row: "row", tile: "tile" } as const
export type UploadPreviewVariant = ValueOf<typeof UploadPreviewVariant>
type UploadAction = { label: string; onClick: () => void }
type UploadTransfer = {
  state: "queued" | "uploading" | "success" | "error" | "cancelled"
  label: string
  progress?: number
}
function fileTypeIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon
  if (type.startsWith("video/")) return VideoIcon
  if (type.startsWith("audio/")) return MusicIcon
  if (type === "application/pdf") return FileTextIcon
  return FileIcon
}
function UploadPreviewMedia({
  type,
  thumbnail,
  variant
}: {
  type: string
  thumbnail?: { src: string; alt: string }
  variant: UploadPreviewVariant
}) {
  const Icon = fileTypeIcon(type)
  if (variant === UploadPreviewVariant.tile)
    return (
      <div data-slot="upload-preview-media" {...stylex.props(style.tileMedia)}>
        {thumbnail ? (
          <img src={thumbnail.src} alt={thumbnail.alt} {...stylex.props(style.image)} />
        ) : (
          <Icon aria-hidden="true" {...stylex.props(style.tileIcon)} />
        )}
      </div>
    )
  return (
    <ItemMedia variant={thumbnail ? "image" : "icon"}>
      {thumbnail ? (
        <img src={thumbnail.src} alt={thumbnail.alt} {...stylex.props(style.image)} />
      ) : (
        <Icon aria-hidden="true" {...stylex.props(style.icon)} />
      )}
    </ItemMedia>
  )
}
function UploadPreviewContent({
  name,
  description,
  transfer
}: {
  name: string
  description?: ReactNode
  transfer?: UploadTransfer
}) {
  return (
    <ItemContent className={stylex.props(style.content).className}>
      <ItemTitle className={stylex.props(style.title).className}>{name}</ItemTitle>
      {description && <ItemDescription>{description}</ItemDescription>}
      {transfer && <div role="status">{transfer.label}</div>}
      {transfer?.state === "uploading" && (
        <progress
          {...stylex.props(style.progress)}
          aria-label={transfer.label}
          max={100}
          value={transfer.progress === undefined ? undefined : Math.min(100, Math.max(0, transfer.progress))}
        />
      )}
    </ItemContent>
  )
}
function UploadPreviewActions({
  transfer,
  disabled,
  previewAction,
  removeAction,
  retryAction,
  cancelAction
}: {
  transfer?: UploadTransfer
  disabled?: boolean
  previewAction?: UploadAction
  removeAction?: UploadAction
  retryAction?: UploadAction
  cancelAction?: UploadAction
}) {
  const canRetry = (transfer?.state === "error" || transfer?.state === "cancelled") && retryAction
  const canCancel = (transfer?.state === "queued" || transfer?.state === "uploading") && cancelAction
  return (
    <ItemActions>
      {canRetry && (
        <Button variant="outline" disabled={disabled} onClick={retryAction.onClick}>
          {retryAction.label}
        </Button>
      )}
      {canCancel && (
        <Button variant="outline" disabled={disabled} onClick={cancelAction.onClick}>
          {cancelAction.label}
        </Button>
      )}
      {previewAction && (
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label={previewAction.label}
          onClick={previewAction.onClick}>
          <EyeIcon aria-hidden="true" {...stylex.props(style.icon)} />
        </Button>
      )}
      {removeAction && (
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label={removeAction.label}
          onClick={removeAction.onClick}>
          <XIcon aria-hidden="true" {...stylex.props(style.icon)} />
        </Button>
      )}
    </ItemActions>
  )
}
export function UploadPreview({
  name,
  type = "",
  description,
  thumbnail,
  previewAction,
  removeAction,
  retryAction,
  cancelAction,
  transfer,
  disabled,
  variant = UploadPreviewVariant.row,
  className
}: {
  variant?: UploadPreviewVariant
  name: string
  type?: string
  description?: ReactNode
  thumbnail?: { src: string; alt: string }
  previewAction?: UploadAction
  removeAction?: UploadAction
  retryAction?: UploadAction
  cancelAction?: UploadAction
  transfer?: UploadTransfer
  disabled?: boolean
  className?: string
}) {
  return (
    <Item
      variant="outline"
      data-slot="upload-preview"
      data-state={transfer?.state}
      data-variant={variant}
      className={[variant === UploadPreviewVariant.tile && stylex.props(style.tile).className, className]
        .filter(Boolean)
        .join(" ")}>
      <UploadPreviewMedia type={type} thumbnail={thumbnail} variant={variant} />
      <UploadPreviewContent name={name} description={description} transfer={transfer} />
      <UploadPreviewActions
        transfer={transfer}
        disabled={disabled}
        previewAction={previewAction}
        removeAction={removeAction}
        retryAction={retryAction}
        cancelAction={cancelAction}
      />
    </Item>
  )
}
