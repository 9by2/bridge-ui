import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, ReactNode } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    overflow: "hidden",
    borderRadius: token.shapeSurface,
    backgroundColor: token.card,
    color: token.cardForeground,
    boxShadow: `0 0 0 1px ${token.border}`
  },
  media: { position: "relative", minHeight: 180, overflow: "hidden", backgroundColor: token.muted },
  body: {
    position: "relative",
    padding: 20,
    "::before": {
      position: "absolute",
      top: -10,
      left: 0,
      width: "100%",
      height: 20,
      backgroundImage: `radial-gradient(circle at 10px -2px, transparent 11px, ${token.card} 12px)`,
      backgroundSize: "20px 20px",
      content: '""'
    }
  },
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
