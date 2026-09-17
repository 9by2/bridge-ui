import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div>
      <UI.Receipt>
        <UI.ReceiptRow>
          <dt>Ticket type with a considerably longer descriptive label than usual</dt>
          <dd>฿1,280.00</dd>
        </UI.ReceiptRow>
        <UI.ReceiptRow>
          <dt>บัตรเข้าชมคอนเสิร์ต</dt>
          <dd>฿480.00</dd>
        </UI.ReceiptRow>
        <UI.ReceiptRow separator={false}>
          <dt>Total</dt>
          <dd>฿1,760.00</dd>
        </UI.ReceiptRow>
      </UI.Receipt>
      <UI.ReceiptDetail>เงื่อนไขการคืนเงิน: ราคาตั๋วไม่สามารถขอคืนเงินได้ ยกเว้นในกรณีที่การแสดงถูกยกเลิก</UI.ReceiptDetail>
    </div>
  )
}
