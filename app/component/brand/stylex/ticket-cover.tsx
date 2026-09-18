import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, ReactNode } from "react"

import { token } from "./token.stylex"

/**
 * Ticket-notch silhouette. Inline data URL so the mask ships with the component
 * source rather than a separate static asset; the frame is masked instead of
 * simply clipped, so the side notches always cut through regardless of caller
 * media. `aspectRatio: "16 / 9"` on the masked frame keeps the mask's own 16x9
 * proportions from ever stretching or skewing.
 */
const ticketMask =
  "url(\"data:image/svg+xml,%3Csvg width='16' height='9' viewBox='0 0 16 9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 3.97754C15.7039 3.97764 15.464 4.21762 15.4639 4.51367C15.4639 4.80981 15.7039 5.04971 16 5.0498V9H0V5.0498C0.296197 5.0498 0.536133 4.80987 0.536133 4.51367C0.536035 4.21756 0.296137 3.97754 0 3.97754V0H16V3.97754Z' fill='currentColor'/%3E%3C/svg%3E\")"

const style = stylex.create({
  root: {
    overflow: "hidden",
    borderRadius: token.shapeSurface,
    backgroundColor: token.card,
    color: token.cardForeground
  },
  media: {
    position: "relative",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    backgroundColor: token.muted,
    maskImage: ticketMask,
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: ticketMask,
    WebkitMaskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center"
  },
  body: { position: "relative", padding: 20 },
  metadata: { color: token.mutedForeground, fontSize: 14 }
})
export type TicketCoverProps = ComponentProps<"article"> & { media?: ReactNode; metadata?: ReactNode }
export function TicketCover({ children, className, media, metadata, ...prop }: TicketCoverProps) {
  return (
    <article
      data-slot="ticket-cover"
      {...prop}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
      {media ? (
        <div data-slot="ticket-cover-media" className={stylex.props(style.media).className}>
          {media}
        </div>
      ) : null}
      <div data-slot="ticket-cover-body" className={stylex.props(style.body).className}>
        {children}
        {metadata ? (
          <div data-slot="ticket-cover-metadata" className={stylex.props(style.metadata).className}>
            {metadata}
          </div>
        ) : null}
      </div>
    </article>
  )
}
