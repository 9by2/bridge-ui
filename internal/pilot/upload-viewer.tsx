import * as stylex from "@stylexjs/stylex"
import { useState, type ComponentProps } from "react"

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
  link: { textDecorationLine: "underline" }
})
export function UploadViewer({
  open,
  onOpenChange,
  source,
  closeLabel,
  downloadLabel,
  fallback,
  finalFocus
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  source: { name: string; type: string; url: string; description?: string }
  closeLabel: string
  downloadLabel: string
  fallback: string
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}) {
  const [failedUrl, setFailedUrl] = useState<string>()
  const safe = /^(https?:|blob:)/i.test(source.url) || /^\/(?!\/)/.test(source.url)
  const media = safe && failedUrl !== source.url
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} finalFocus={finalFocus} className={stylex.props(style.popup).className}>
        <DialogTitle className={stylex.props(style.title).className}>{source.name}</DialogTitle>
        <DialogDescription>{source.description ?? source.type}</DialogDescription>
        {media && source.type.startsWith("image/") ? (
          <img
            {...stylex.props(style.media, style.image)}
            src={source.url}
            alt={source.name}
            onError={() => setFailedUrl(source.url)}
          />
        ) : media && source.type.startsWith("video/") ? (
          <video
            {...stylex.props(style.media)}
            src={source.url}
            controls
            aria-label={source.name}
            onError={() => setFailedUrl(source.url)}
          />
        ) : media && source.type.startsWith("audio/") ? (
          <audio
            {...stylex.props(style.audio)}
            src={source.url}
            controls
            aria-label={source.name}
            onError={() => setFailedUrl(source.url)}
          />
        ) : media && source.type === "application/pdf" ? (
          <iframe {...stylex.props(style.pdf)} src={source.url} title={source.name} sandbox="" />
        ) : (
          <p role="status">{fallback}</p>
        )}
        {source.type === "application/pdf" && <p>{fallback}</p>}
        {safe && (
          <a
            href={source.url}
            download={source.name}
            target="_blank"
            rel="noopener noreferrer"
            {...stylex.props(style.link)}>
            {downloadLabel}
          </a>
        )}
        <DialogClose render={<Button variant="outline" />}>{closeLabel}</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
