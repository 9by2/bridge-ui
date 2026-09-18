import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, ReactNode } from "react"

/**
 * Ticket-notch silhouette. Inline data URL so the mask ships with the component
 * source rather than a separate static asset; the frame is masked instead of
 * simply clipped, so the side notches always cut through regardless of caller
 * media. `aspectRatio: "16 / 9"` on the masked frame keeps the mask's own 16x9
 * proportions from ever stretching or skewing. No border-radius: the mask
 * silhouette alone defines the shape, matching Cue's `ticket-cover-frame`.
 */
const ticketMask =
  "url(\"data:image/svg+xml,%3Csvg width='16' height='9' viewBox='0 0 16 9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 3.97754C15.7039 3.97764 15.464 4.21762 15.4639 4.51367C15.4639 4.80981 15.7039 5.04971 16 5.0498V9H0V5.0498C0.296197 5.0498 0.536133 4.80987 0.536133 4.51367C0.536035 4.21756 0.296137 3.97754 0 3.97754V0H16V3.97754Z' fill='currentColor'/%3E%3C/svg%3E\")"

const style = stylex.create({
  root: {
    position: "relative",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    maskImage: ticketMask,
    maskSize: "100% 100%",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: ticketMask,
    WebkitMaskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center"
  }
})
export type TicketCoverProps = ComponentProps<"div"> & { children: ReactNode }
/**
 * Ticket-notch masked media frame: image only, full-bleed cover, locked 16/9
 * ratio. Title, date, and location are caller-composed siblings, not part of
 * this component (matches Cue's `ticket-cover-frame` + separate header).
 */
export function TicketCover({ children, className, ...prop }: TicketCoverProps) {
  return (
    <div
      data-slot="ticket-cover"
      {...prop}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  )
}
