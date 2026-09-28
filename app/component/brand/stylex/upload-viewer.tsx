import * as stylex from "@stylexjs/stylex"
import { useState, type ComponentProps, type ReactNode } from "react"

import { Button } from "./button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "./dialog"

const style = stylex.create({
  popup: {
    maxWidth: { default: "calc(100% - 2rem)", "@media (min-width: 640px)": "48rem" },
    maxHeight: "90dvh",
    overflow: "auto"
  },
  title: { wordBreak: "break-all" },
  media: { maxHeight: "60dvh", width: "100%" },
  image: { objectFit: "contain" },
  audio: { width: "100%" },
  pdf: { height: "55dvh", width: "100%", borderWidth: 0 },
  link: { textDecorationLine: "underline" },
  footer: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--bridge-unit-8, 8px)" }
})

type ValueOf<T> = T[keyof T]

/** Caller-controlled viewer state. The viewer never fetches; the caller resolves the URL. */
export const UploadViewerStatus = { loading: "loading", ready: "ready", error: "error" } as const
export type UploadViewerStatus = ValueOf<typeof UploadViewerStatus>

export type UploadViewerSource = { name: string; type: string; url?: string; description?: string }

export type UploadViewerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  source: UploadViewerSource
  closeLabel: string
  downloadLabel: string
  /** Shown for unsupported types, missing/unsafe URL, media failure, and `status="error"`. */
  fallback: string
  /** Default `ready`. PDF failure cannot be detected from an iframe; pass `error` explicitly. */
  status?: UploadViewerStatus
  /** Announced while `status="loading"`. */
  statusLabel?: string
  /** Extra caller-owned controls (e.g. open in new tab), shown only when the file is viewable. */
  action?: ReactNode
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}

const safeUrl = (url: string | undefined): url is string =>
  !!url && (/^(https?:|blob:)/i.test(url) || /^\/(?!\/)/.test(url))

function ViewerMedia({
  source,
  fallback,
  onError
}: {
  source: { name: string; type: string; url: string }
  fallback: string
  onError: () => void
}) {
  if (source.type.startsWith("image/"))
    return <img {...stylex.props(style.media, style.image)} src={source.url} alt={source.name} onError={onError} />
  if (source.type.startsWith("video/"))
    return <video {...stylex.props(style.media)} src={source.url} controls aria-label={source.name} onError={onError} />
  if (source.type.startsWith("audio/"))
    return <audio {...stylex.props(style.audio)} src={source.url} controls aria-label={source.name} onError={onError} />
  if (source.type === "application/pdf")
    return <iframe {...stylex.props(style.pdf)} src={source.url} title={source.name} sandbox="" />
  return <p role="status">{fallback}</p>
}

function ViewerBody({
  status,
  statusLabel,
  source,
  fallback,
  failed,
  onError
}: {
  status: UploadViewerStatus
  statusLabel?: string
  source: UploadViewerSource
  fallback: string
  failed: boolean
  onError: () => void
}) {
  if (status === UploadViewerStatus.loading) return <p role="status">{statusLabel}</p>
  if (status === UploadViewerStatus.error) return <p role="alert">{fallback}</p>
  if (!safeUrl(source.url) || failed) return <p role="status">{fallback}</p>
  return <ViewerMedia source={{ ...source, url: source.url }} fallback={fallback} onError={onError} />
}

/** Lives inside the popup, so media-failure state resets whenever the dialog closes and reopens. */
function ViewerPanel({
  source,
  closeLabel,
  downloadLabel,
  fallback,
  status,
  statusLabel,
  action
}: Omit<UploadViewerProps, "open" | "onOpenChange" | "finalFocus"> & { status: UploadViewerStatus }) {
  const [failedKey, setFailedKey] = useState<string>()
  const key = `${source.type}|${source.url ?? ""}`
  const failed = failedKey === key
  const viewable = status === UploadViewerStatus.ready && safeUrl(source.url) && !failed
  return (
    <>
      <DialogTitle className={stylex.props(style.title).className}>{source.name}</DialogTitle>
      <DialogDescription>{source.description ?? source.type}</DialogDescription>
      <ViewerBody
        status={status}
        statusLabel={statusLabel}
        source={source}
        fallback={fallback}
        failed={failed}
        onError={() => setFailedKey(key)}
      />
      <div data-slot="upload-viewer-footer" {...stylex.props(style.footer)}>
        {viewable && (
          <a
            href={source.url}
            download={source.name}
            target="_blank"
            rel="noopener noreferrer"
            {...stylex.props(style.link)}>
            {downloadLabel}
          </a>
        )}
        {viewable && action}
        <DialogClose render={<Button variant="outline" />}>{closeLabel}</DialogClose>
      </div>
    </>
  )
}

export function UploadViewer({
  open,
  onOpenChange,
  finalFocus,
  status = UploadViewerStatus.ready,
  ...panel
}: UploadViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} finalFocus={finalFocus} className={stylex.props(style.popup).className}>
        <ViewerPanel status={status} {...panel} />
      </DialogContent>
    </Dialog>
  )
}
