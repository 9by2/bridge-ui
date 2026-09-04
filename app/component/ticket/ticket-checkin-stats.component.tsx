import { m } from "@cue/web/shared/i18n/runtime/messages"

export interface TicketCheckinStatsItemView {
  readonly ticketTypeId: string
  readonly ticketTypeName: string
  readonly total: number
  readonly checkedIn: number
}

export interface TicketCheckinStatsView {
  readonly total: number
  readonly checkedIn: number
  readonly items: readonly TicketCheckinStatsItemView[]
}

export function TicketCheckinStatsComponent({ stats }: { readonly stats: TicketCheckinStatsView | undefined }) {
  if (!stats) return null
  return (
    <section
      className="grid gap-3 border border-border bg-card p-4 sm:border-white/10 sm:bg-white/[0.03]"
      aria-label={m.studio_event_checkin_stats_title()}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {m.studio_event_checkin_stats_title()}
        </h2>
        <p className="font-number text-2xl font-semibold text-highlight">
          {stats.checkedIn}
          <span className="text-base font-normal text-muted-foreground">/{stats.total}</span>
        </p>
      </div>
      <StatsBar checkedIn={stats.checkedIn} total={stats.total} />
      {stats.items.length > 1 ? (
        <dl className="grid gap-2">
          {stats.items.map((item) => (
            <div key={item.ticketTypeId} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
              <dt className="truncate text-sm text-muted-foreground">{item.ticketTypeName}</dt>
              <dd className="font-number text-sm font-medium text-foreground">
                {item.checkedIn}/{item.total}
              </dd>
              <div className="col-span-2">
                <StatsBar checkedIn={item.checkedIn} total={item.total} />
              </div>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  )
}

function StatsBar({ checkedIn, total }: { readonly checkedIn: number; readonly total: number }) {
  const ratio = total > 0 ? Math.min(checkedIn / total, 1) : 0
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
      <div className="h-full rounded-full bg-brand" style={{ width: `${Math.round(ratio * 100)}%` }} />
    </div>
  )
}
