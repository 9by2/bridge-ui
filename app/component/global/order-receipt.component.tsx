interface OrderReceiptComponentProps {
  readonly eventLabel: string
  readonly eventName: string
  readonly ticketLabel: string
  readonly ticketSummaryLabel: string
  readonly amountLabel: string
  readonly amountValueLabel: string
}

/**
 * Screenshot-able proof of purchase for the return page's paid state (design D6).
 * Pure presentation: every string is pre-formatted by `CreateMeOrderReturnPaidView` —
 * this component owns no currency, date, or i18n logic.
 */
export function OrderReceiptComponent({
  eventLabel,
  eventName,
  ticketLabel,
  ticketSummaryLabel,
  amountLabel,
  amountValueLabel
}: OrderReceiptComponentProps) {
  return (
    <dl className="w-full overflow-hidden rounded-lg border border-border bg-secondary/40 text-left">
      <ReceiptRow term={eventLabel} detail={eventName} />
      <ReceiptRow term={ticketLabel} detail={ticketSummaryLabel} />
      <ReceiptRow term={amountLabel} detail={amountValueLabel} />
    </dl>
  )
}

function ReceiptRow({ term, detail }: { readonly term: string; readonly detail: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-dashed border-border px-3.5 py-2.5 text-sm first:border-t-0">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-right font-semibold text-highlight">{detail}</dd>
    </div>
  )
}
