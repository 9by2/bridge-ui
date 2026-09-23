import { CalendarDays, CircleDollarSign, ReceiptText, Ticket, Users } from "lucide-react"

import { MetricTile, Theme } from "@bridge/ui"

export default function Example() {
  return (
    <Theme mode="dark" style={{ width: "100%" }}>
      <section aria-label="Event summary metrics" style={{ width: "100%", padding: 24, background: "#141414" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 12 }}>
          <MetricTile
            variants="featured"
            label="Revenue"
            value="฿204,215"
            description="Successful orders"
            icon={<CircleDollarSign size={18} />}
          />
          <MetricTile
            variants="standard"
            label="Orders"
            value="753"
            description="All statuses"
            icon={<ReceiptText size={18} />}
          />
          <MetricTile variants="standard" label="Events" value="6" icon={<CalendarDays size={18} />} />
          <MetricTile variants="standard" label="Generated tickets" value="569" icon={<Ticket size={18} />} />
          <MetricTile variants="compact" label="Users" value="662" icon={<Users size={18} />} />
          <MetricTile variants="compact" label="Staff" value="7" />
          <MetricTile variants="compact" label="Active tickets" value="558" description="Issued + checked in" />
          <MetricTile variants="compact" label="Checked in" value="505" />
          <MetricTile variants="compact" label="Refunds" value="฿743" />
        </div>
      </section>
    </Theme>
  )
}
