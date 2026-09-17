import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div>
      <UI.Receipt>
        <UI.ReceiptRow>
          <dt>Subtotal</dt>
          <dd>$80.00</dd>
        </UI.ReceiptRow>
        <UI.ReceiptRow>
          <dt>Total</dt>
          <dd>$80.00</dd>
        </UI.ReceiptRow>
      </UI.Receipt>
      <UI.ReceiptDetail>Caller-provided terms</UI.ReceiptDetail>
    </div>
  )
}
