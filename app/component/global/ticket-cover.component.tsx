import { ResponsiveImage } from "@bridge/ui/app/component/global/responsive-image.component"
import { Body, Heading } from "@bridge/ui/app/component/global/typography.component"
import { cn } from "cn"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"

export const TicketCoverMeta = {
  DATE: "date",
  TIME: "time",
  LOCATION: "location"
} as const
export type TicketCoverMeta = (typeof TicketCoverMeta)[keyof typeof TicketCoverMeta]

export interface TicketCoverDetail {
  readonly coverImageSrc: string
  readonly title: string
  /** Date label; when shown via `meta: ["date"]`, include time in this string. */
  readonly dateLabel: string
  readonly timeLabel?: string | undefined
  readonly venueName: string
}

export interface TicketCoverProps {
  readonly ticket: TicketCoverDetail
  /**
   * Optional rows under the title. Empty (default) hides them completely —
   * use on ticket surfaces that already list show time/location elsewhere.
   * Order detail passes `["date", "location"]` (date includes time).
   */
  readonly meta?: readonly TicketCoverMeta[] | undefined
  readonly variant?: "default" | "icon" | undefined
  readonly className?: string | undefined
  readonly frameClassName?: string | undefined
}

export function TicketCover({ className, frameClassName, ticket, meta = [], variant = "default" }: TicketCoverProps) {
  const isIcon = variant === "icon"

  return (
    <section className={cn(isIcon ? "p-0" : "px-4 py-4", className)} aria-label={isIcon ? ticket.title : undefined}>
      {isIcon ? null : <TicketCoverHeader ticket={ticket} meta={meta} />}
      <div
        data-slot="ticket-cover-frame"
        className={cn(
          "relative aspect-video overflow-hidden shadow-[inset_0_4px_4px_rgba(--highlight)] [mask:url('data:image/svg+xml,%3Csvg width='160' height='90' viewBox='0 0 160 90' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M160 39.7765C157.038 39.7765 154.637 42.1777 154.637 45.1397C154.637 48.1016 157.038 50.5028 160 50.5028V90H0V50.5028C2.96197 50.5028 5.36313 48.1016 5.36313 45.1397C5.36313 42.1777 2.96197 39.7765 0 39.7765V0H160V39.7765Z' fill='currentColor'/%3E%3C/svg%3E%0A')_center/100%_100%_no-repeat] [-webkit-mask:url('data:image/svg+xml,%3Csvg width='160' height='90' viewBox='0 0 160 90' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M160 39.7765C157.038 39.7765 154.637 42.1777 154.637 45.1397C154.637 48.1016 157.038 50.5028 160 50.5028V90H0V50.5028C2.96197 50.5028 5.36313 48.1016 5.36313 45.1397C5.36313 42.1777 2.96197 39.7765 0 39.7765V0H160V39.7765Z' fill='currentColor'/%3E%3C/svg%3E%0A')_center/100%_100%_no-repeat]",
          frameClassName
        )}>
        <ResponsiveImage
          src={ticket.coverImageSrc}
          decorative
          sizes={isIcon ? "96px" : "100vw"}
          className="size-full object-cover"
        />
      </div>
    </section>
  )
}

function TicketCoverHeader({
  ticket,
  meta
}: {
  readonly ticket: TicketCoverDetail
  readonly meta: readonly TicketCoverMeta[]
}) {
  const showDate = meta.includes(TicketCoverMeta.DATE)
  const showTime = meta.includes(TicketCoverMeta.TIME)
  const showLocation = meta.includes(TicketCoverMeta.LOCATION)
  const timeLabel = ticket.timeLabel?.trim()
  const venueName = ticket.venueName.trim()

  return (
    <header className="mb-3 flex flex-col gap-1.5">
      <Heading as="h1" className="text-2xl font-bold leading-tight text-highlight">
        {ticket.title}
      </Heading>
      {showDate && ticket.dateLabel ? (
        <Body className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <CalendarIcon aria-hidden="true" className="size-4 shrink-0 text-brand" />
          <span className="text-brand">{ticket.dateLabel}</span>
        </Body>
      ) : null}
      {showTime && timeLabel ? (
        <Body className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ClockIcon aria-hidden="true" className="size-4 shrink-0 text-brand" />
          <span className="text-brand">{timeLabel}</span>
        </Body>
      ) : null}
      {showLocation && venueName ? (
        <Body className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MapPinIcon aria-hidden="true" className="size-4 shrink-0 text-brand" />
          <span className="text-brand">{venueName}</span>
        </Body>
      ) : null}
    </header>
  )
}
