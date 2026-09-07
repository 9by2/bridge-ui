import { EyeIcon, FileIcon, FileTextIcon, ImageIcon, MusicIcon, VideoIcon, XIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "../shadcn/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../shadcn/item"

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
  className
}: {
  name: string
  type?: string
  description?: ReactNode
  thumbnail?: { src: string; alt: string }
  previewAction?: { label: string; onClick: () => void }
  removeAction?: { label: string; onClick: () => void }
  retryAction?: { label: string; onClick: () => void }
  cancelAction?: { label: string; onClick: () => void }
  transfer?: { state: "queued" | "uploading" | "success" | "error" | "cancelled"; label: string; progress?: number }
  disabled?: boolean
  className?: string
}) {
  const Icon = type.startsWith("image/")
    ? ImageIcon
    : type.startsWith("video/")
      ? VideoIcon
      : type.startsWith("audio/")
        ? MusicIcon
        : type === "application/pdf"
          ? FileTextIcon
          : FileIcon
  return (
    <Item variant="outline" data-slot="upload-preview" data-state={transfer?.state} className={className}>
      <ItemMedia variant={thumbnail ? "image" : "icon"}>
        {thumbnail ? <img src={thumbnail.src} alt={thumbnail.alt} /> : <Icon aria-hidden="true" />}
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle className="line-clamp-none break-all">{name}</ItemTitle>
        {description && <ItemDescription>{description}</ItemDescription>}
        {transfer && <div role="status">{transfer.label}</div>}
        {transfer?.state === "uploading" && (
          <progress
            className="w-full"
            aria-label={transfer.label}
            max={100}
            value={transfer.progress === undefined ? undefined : Math.min(100, Math.max(0, transfer.progress))}
          />
        )}
      </ItemContent>
      <ItemActions>
        {(transfer?.state === "error" || transfer?.state === "cancelled") && retryAction && (
          <Button variant="outline" disabled={disabled} onClick={retryAction.onClick}>
            {retryAction.label}
          </Button>
        )}
        {(transfer?.state === "queued" || transfer?.state === "uploading") && cancelAction && (
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
            <EyeIcon aria-hidden="true" />
          </Button>
        )}
        {removeAction && (
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            aria-label={removeAction.label}
            onClick={removeAction.onClick}>
            <XIcon aria-hidden="true" />
          </Button>
        )}
      </ItemActions>
    </Item>
  )
}
