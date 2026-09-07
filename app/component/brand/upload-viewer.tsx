import { useState } from "react"
import type { ComponentProps } from "react"

import { Button } from "../shadcn/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../shadcn/dialog"

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
      <DialogContent
        showCloseButton={false}
        finalFocus={finalFocus}
        className="sm:max-w-3xl max-h-[90dvh] overflow-auto">
        <DialogTitle className="break-all">{source.name}</DialogTitle>
        <DialogDescription>{source.description ?? source.type}</DialogDescription>
        {media && source.type.startsWith("image/") ? (
          <img
            className="max-h-[60dvh] w-full object-contain"
            src={source.url}
            alt={source.name}
            onError={() => setFailedUrl(source.url)}
          />
        ) : media && source.type.startsWith("video/") ? (
          <video
            className="max-h-[60dvh] w-full"
            src={source.url}
            controls
            aria-label={source.name}
            onError={() => setFailedUrl(source.url)}
          />
        ) : media && source.type.startsWith("audio/") ? (
          <audio
            className="w-full"
            src={source.url}
            controls
            aria-label={source.name}
            onError={() => setFailedUrl(source.url)}
          />
        ) : media && source.type === "application/pdf" ? (
          <iframe className="h-[55dvh] w-full" src={source.url} title={source.name} sandbox="" />
        ) : (
          <p role="status">{fallback}</p>
        )}
        {source.type === "application/pdf" && <p>{fallback}</p>}
        {safe && (
          <a href={source.url} download={source.name} target="_blank" rel="noopener noreferrer" className="underline">
            {downloadLabel}
          </a>
        )}
        <DialogClose render={<Button variant="outline" />}>{closeLabel}</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
