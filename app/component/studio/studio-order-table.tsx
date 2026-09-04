import { Button } from "@cue/web/app/component/shadcn/button"
import { StudioStatusPill } from "@cue/web/app/component/studio/studio-status-pill"
import type { StudioOrderRowView } from "@cue/web/app/mapper/studio-order.mapper"
import { m } from "@cue/web/shared/i18n/runtime/messages"

export function StudioOrderRow({
  canSeeVatDetail,
  eventName,
  onOpenDetail,
  order
}: {
  readonly canSeeVatDetail: boolean
  readonly eventName?: string | undefined
  readonly onOpenDetail: () => void
  readonly order: StudioOrderRowView
}) {
  return (
    <tr className="border-t border-white/10">
      <td className="px-4 py-4 align-top">
        <div className="font-heading font-semibold text-highlight">{order.orderPublicCode}</div>
        <div className="mt-1 font-body text-xs text-highlight/45">{order.orderId}</div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 mt-1"
          aria-label={`${m.studio_order_view_detail()} ${order.orderPublicCode}`}
          onClick={onOpenDetail}>
          {m.studio_order_view_detail()}
        </Button>
      </td>
      {eventName !== undefined ? <td className="px-4 py-4 align-top text-highlight/70">{eventName}</td> : null}
      <td className="px-4 py-4 align-top text-highlight/70">
        <div>{order.buyerEmail || m.studio_order_buyer_unknown()}</div>
        {order.buyerSubject ? <div className="mt-1 text-xs text-highlight/45">{order.buyerSubject}</div> : null}
      </td>
      {canSeeVatDetail ? <MoneyCell value={order.subtotalLabel} /> : null}
      {canSeeVatDetail ? <MoneyCell value={order.vatLabel} /> : null}
      <MoneyCell value={order.feeLabel} />
      <td className="px-4 py-4 align-top">
        <StudioStatusPill tone={order.orderStatusTone}>{order.orderStatusLabel}</StudioStatusPill>
      </td>
      <td className="px-4 py-4 align-top">
        <StudioStatusPill tone={order.paymentStatusTone}>{order.paymentStatusLabel}</StudioStatusPill>
      </td>
      <td className="px-4 py-4 align-top">
        <StudioStatusPill tone={order.ticketIssueTone}>{order.ticketIssueLabel}</StudioStatusPill>
      </td>
      <td className="px-4 py-4 text-right align-top font-heading font-semibold text-highlight">{order.totalLabel}</td>
    </tr>
  )
}

function MoneyCell({ value }: { readonly value: string }) {
  return <td className="px-4 py-4 text-right align-top text-highlight/70">{value}</td>
}
