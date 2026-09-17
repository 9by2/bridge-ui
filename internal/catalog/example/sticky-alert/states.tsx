import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <UI.StickyAlert tone="neutral" offset="0" aria-label="Payment status">
        การชำระเงินของคุณกำลังอยู่ระหว่างดำเนินการ กรุณารอสักครู่
      </UI.StickyAlert>
      <UI.StickyAlert tone="destructive" offset="0" aria-label="Checkout error">
        This event has an unusually long caller-provided alert message describing exactly why the checkout session
        expired and what the buyer should do next.
      </UI.StickyAlert>
      <UI.StickyAlert tone="success" offset="0" aria-label="Order confirmation">
        Order confirmed
      </UI.StickyAlert>
    </div>
  )
}
