import { StudioStatusPill, type StudioStatusTone } from "@bridge/ui/app/component/studio/studio-status-pill"
import { FormatFinancialReportPaidAt } from "@cue/web/app/lib/financial-report-paid-at"
import { TicketOrderStatus } from "@cue/web/shared/config/order"
import { DefaultTimezone } from "@cue/web/shared/config/timezone"
import type { FinancialReportOrderLine } from "@cue/web/shared/financial-report/contract"
import { FinancialReportColumns } from "@cue/web/shared/financial-report/contract"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { getLocale } from "@cue/web/shared/i18n/runtime/runtime.js"

// react-doctor-disable-next-line only-export-components -- Existing report controls import this shared label registry.
export const FinancialReportColumnLabels = {
  orderNumber: m.studio_financial_report_column_order_number,
  referenceCode: m.studio_financial_report_column_reference_code,
  paidAt: m.studio_financial_report_column_paid_at,
  eventName: m.studio_financial_report_column_event_name,
  email: m.studio_financial_report_column_email,
  phoneNumber: m.studio_financial_report_column_phone_number,
  paymentMethod: m.studio_financial_report_column_payment_method,
  orderStatus: m.studio_financial_report_column_order_status,
  unitPrice: m.studio_financial_report_column_unit_price,
  amount: m.studio_financial_report_column_amount,
  discount: m.studio_financial_report_column_discount,
  subtotal: m.studio_financial_report_column_subtotal,
  ticketVat: m.studio_financial_report_column_ticket_vat,
  platformFee: m.studio_financial_report_column_platform_fee,
  paymentFee: m.studio_financial_report_column_payment_fee,
  total: m.studio_financial_report_column_total
} as const

const NumericAlignColumnKeys = new Set([
  "unitPrice",
  "amount",
  "discount",
  "subtotal",
  "ticketVat",
  "platformFee",
  "paymentFee",
  "total"
])

const StickyColumnLeft = [0, 150, 454] as const
const StickyColumnWidth = [150, 304, 176] as const

export function FinancialReportTable({
  rows,
  timezone = DefaultTimezone,
  onSelect
}: {
  readonly rows: readonly FinancialReportOrderLine[]
  readonly timezone?: string | undefined
  readonly onSelect?: ((row: FinancialReportOrderLine) => void) | undefined
}) {
  const columnCount = FinancialReportColumns.length
  return (
    <>
      <p role="note" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm">
        {m.studio_financial_report_repeated_value_warning()}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-highlight/60">
        <p>{m.studio_financial_report_amount_helper()}</p>
        <p>{m.studio_financial_report_columns_visible({ visible: columnCount, total: columnCount })}</p>
      </div>
      <div className="overflow-x-auto border border-white/10">
        <table className="min-w-[2150px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              {FinancialReportColumns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 ${index < 3 ? "sticky z-20 bg-background" : ""} ${
                    NumericAlignColumnKeys.has(column.key) ? "tabular-nums text-right" : ""
                  }`}
                  style={StickyColumnStyle(index)}>
                  {FinancialReportColumnLabels[column.key]()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={FinancialReportRowKey(row)} className="border-t border-white/10">
                {FinancialReportColumns.map((column, columnIndex) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-4 py-3 ${columnIndex < 3 ? "sticky z-10 bg-background" : ""} ${
                      NumericAlignColumnKeys.has(column.key) ? "tabular-nums text-right" : ""
                    }`}
                    style={StickyColumnStyle(columnIndex)}>
                    {columnIndex === 0 && onSelect ? (
                      <button type="button" className="underline" onClick={() => onSelect(row)}>
                        {row.orderNumber}
                      </button>
                    ) : row[column.key] === null ? (
                      <span aria-label={m.studio_financial_report_unavailable()}>—</span>
                    ) : column.key === "referenceCode" ? (
                      <span className="font-mono text-xs text-highlight/70">{row.referenceCode}</span>
                    ) : column.key === "paidAt" ? (
                      FormatFinancialReportPaidAt(row.paidAt, getLocale(), timezone)
                    ) : column.key === "orderStatus" ? (
                      <StudioStatusPill tone={OrderStatusTone(row.orderStatus)}>
                        {OrderStatusLabel(row.orderStatus)}
                      </StudioStatusPill>
                    ) : (
                      String(row[column.key])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function StickyColumnStyle(index: number): React.CSSProperties | undefined {
  if (index >= StickyColumnLeft.length) return undefined
  return { left: StickyColumnLeft[index], minWidth: StickyColumnWidth[index] }
}

function FinancialReportRowKey(row: FinancialReportOrderLine): string {
  return FinancialReportColumns.map((column) => String(row[column.key])).join("\u0000")
}

function OrderStatusLabel(status: string): string {
  switch (status) {
    case TicketOrderStatus.AWAITING_PAYMENT:
      return m.studio_order_status_awaiting_payment()
    case TicketOrderStatus.CONFIRMED:
      return m.studio_order_status_confirmed()
    case TicketOrderStatus.ISSUE_PENDING:
      return m.studio_order_status_issue_pending()
    case TicketOrderStatus.ISSUED:
      return m.studio_order_status_issued()
    case TicketOrderStatus.CANCELLED:
      return m.studio_order_status_cancelled()
    case TicketOrderStatus.EXPIRED:
      return m.studio_order_status_expired()
    case TicketOrderStatus.REFUNDED:
      return m.studio_order_status_refunded()
    default:
      return status.replaceAll("_", " ")
  }
}

function OrderStatusTone(status: string): StudioStatusTone {
  if (status === TicketOrderStatus.CONFIRMED || status === TicketOrderStatus.ISSUED) return "success"
  if (
    status === TicketOrderStatus.CANCELLED ||
    status === TicketOrderStatus.EXPIRED ||
    status === TicketOrderStatus.REFUNDED
  ) {
    return "neutral"
  }
  return "pending"
}
