import { MetricTile } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12 }}>
      <MetricTile variants="standard" label="Orders" value="753" loading loadingLabel="Loading orders" />
      <MetricTile variants="standard" label="Refunds" value="—" description="Not available" />
      <MetricTile variants="featured" label="ยอดรายได้ทั้งหมด" value="฿204,215" description="คำสั่งซื้อที่สำเร็จ" />
      <MetricTile variants="compact" label="A long metric value" value="1,234,567,890.12" />
    </div>
  )
}
