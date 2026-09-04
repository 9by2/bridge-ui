import { m } from "@cue/web/shared/i18n/runtime/messages"
import { cn } from "cn"
import { QrCodeIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import QRCode from "react-qr-code"

import { LogoComponent } from "./logo.component"
import { ResponsiveImage } from "./responsive-image.component"
import { Heading } from "./typography.component"

export const TicketUICardSide = {
  FRONT: "front",
  BACK: "back"
} as const
export type TicketUICardSide = ValueOf<typeof TicketUICardSide>

export interface TicketUICardData {
  readonly numberLabel?: string | undefined
  readonly title: string
  readonly categoryLabel: string
  readonly seatLabel?: string | undefined
  readonly imageSrc: string
  readonly imageAlt?: string | undefined
  readonly logoLabel?: string | undefined
}

export interface TicketUICardComponentProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  readonly ticket: TicketUICardData
  readonly code: string
  readonly baseBackgroundClassName: string
  readonly side?: TicketUICardSide | undefined
  readonly initialSide?: TicketUICardSide | undefined
  readonly qrTitle?: string | undefined
  readonly qrClassName?: string | undefined
}

const TicketUICardDefaultSide = TicketUICardSide.FRONT
const TicketUICardQrSize = 168

export function TicketUICardComponent({
  ticket,
  code,
  side,
  initialSide = TicketUICardDefaultSide,
  qrTitle = m.ticket_ui_card_qr_title(),
  qrClassName,
  baseBackgroundClassName,
  className,
  ...props
}: TicketUICardComponentProps) {
  const activeSide = side ?? initialSide
  const titleLabel = CreateAccessibleTitle(ticket.title)
  const isBackSide = activeSide === TicketUICardSide.BACK

  return (
    <div
      data-slot="ticket-ui-card"
      data-side={activeSide}
      className={cn("w-76 perspective-[1000px]", className)}
      {...props}>
      <div
        data-slot="ticket-ui-card-frame"
        className={cn(
          "relative aspect-100/185 w-full transition-transform duration-500 ease-out will-change-transform transform-3d motion-reduce:transition-none",
          isBackSide && "[transform:rotateY(180deg)]"
        )}>
        <TicketUICardFront
          ticket={ticket}
          titleLabel={titleLabel}
          baseBackgroundClassName={baseBackgroundClassName}
          active={!isBackSide}
        />
        <TicketUICardBack
          ticket={ticket}
          code={code}
          qrTitle={qrTitle}
          qrClassName={qrClassName}
          titleLabel={titleLabel}
          baseBackgroundClassName={baseBackgroundClassName}
          active={isBackSide}
        />
      </div>
    </div>
  )
}

function TicketUICardFront({
  ticket,
  titleLabel,
  baseBackgroundClassName,
  active
}: {
  readonly ticket: TicketUICardData
  readonly titleLabel: string
  readonly baseBackgroundClassName: string
  readonly active: boolean
}) {
  return (
    <article
      aria-label={m.ticket_ui_card_front_aria_label({ title: titleLabel })}
      aria-hidden={!active}
      data-slot="ticket-ui-card-front"
      className={cn(
        "absolute inset-0 flex select-none flex-col overflow-hidden text-highlight shadow-lg backface-hidden",
        baseBackgroundClassName
      )}>
      <div className="aspect-4/5 overflow-hidden">
        <ResponsiveImage
          src={ticket.imageSrc}
          alt={ticket.imageAlt}
          decorative={!ticket.imageAlt}
          sizes="(min-width: 768px) 384px, 100vw"
          className="size-full object-cover"
        />
      </div>
      <div className="flex min-h-0 flex-1 justify-between gap-4 p-4">
        <div className="flex min-w-0 flex-1 flex-col">
          {ticket.numberLabel ? <p className="text-xs leading-none">{ticket.numberLabel}</p> : null}
          <TicketUICardTitle title={ticket.title} className="mt-2 text-left" />
          <div className="flex-1" />
          <TicketUICardSummary ticket={ticket} align="left" />
        </div>
        <div className="flex shrink-0 flex-col items-end justify-between">
          <div className="flex items-center justify-center text-highlight" aria-hidden="true">
            <QrCodeIcon />
          </div>
          <LogoComponent className="h-4" />
        </div>
      </div>
    </article>
  )
}

function TicketUICardBack({
  ticket,
  code,
  qrTitle,
  qrClassName,
  titleLabel,
  baseBackgroundClassName,
  active
}: {
  readonly ticket: TicketUICardData
  readonly code: string
  readonly qrTitle: string
  readonly qrClassName?: string | undefined
  readonly titleLabel: string
  readonly baseBackgroundClassName: string
  readonly active: boolean
}) {
  return (
    <article
      aria-label={m.ticket_ui_card_back_aria_label({ title: titleLabel })}
      aria-hidden={!active}
      data-slot="ticket-ui-card-back"
      className={cn(
        "absolute inset-0 flex select-none flex-col overflow-hidden text-highlight shadow-lg backface-hidden [transform:rotateY(180deg)]",
        baseBackgroundClassName
      )}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_2%,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_100%)]"
        aria-hidden="true"
      />
      <header className="relative flex items-center justify-between px-4 pt-6">
        <LogoComponent className="h-4" />
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col justify-center gap-7 p-4">
        <div className="flex justify-center">
          <div className="p-0 text-highlight">
            {active ? (
              <QRCode
                value={code}
                size={TicketUICardQrSize}
                title={qrTitle}
                level={"H"}
                bgColor={"transparent"}
                fgColor={"currentColor"}
                viewBox={`0 0 ${TicketUICardQrSize} ${TicketUICardQrSize}`}
                className={qrClassName}
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <p
            className="font-mono text-sm tracking-[0.24em] text-highlight/80"
            aria-label={m.ticket_ui_card_identifier_aria_label()}>
            {code}
          </p>
          <TicketUICardTitle title={ticket.title} className="text-center" />
          <TicketUICardSummary ticket={ticket} align="center" />
        </div>
      </div>
    </article>
  )
}

function TicketUICardTitle({ title, className }: { readonly title: string; readonly className?: string | undefined }) {
  return (
    <Heading as="h3" className={cn("whitespace-pre-line leading-tight font-bold", className)}>
      {title}
    </Heading>
  )
}

function TicketUICardSummary({
  ticket,
  align
}: {
  readonly ticket: TicketUICardData
  readonly align: "left" | "center"
}) {
  return (
    <p
      className={cn(
        "whitespace-pre-line font-body text-xs leading-[1.2] text-[#999999]",
        align === "center" ? "text-center" : "text-left"
      )}>
      <span>{ticket.categoryLabel}</span>
      {ticket.seatLabel ? (
        <>
          <br />
          <span>{ticket.seatLabel}</span>
        </>
      ) : null}
    </p>
  )
}

function CreateAccessibleTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim()
}
