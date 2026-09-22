import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <UI.StatusStamp tone="neutral">Draft</UI.StatusStamp>
      <UI.StatusStamp tone="info">In progress</UI.StatusStamp>
      <UI.StatusStamp tone="pending">Queued</UI.StatusStamp>
      <UI.StatusStamp tone="inactive">Inactive</UI.StatusStamp>
      <UI.StatusStamp tone="partial-success">Partially complete</UI.StatusStamp>
      <UI.StatusStamp tone="success">Confirmed</UI.StatusStamp>
      <UI.StatusStamp tone="warning">Pending review</UI.StatusStamp>
      <UI.StatusStamp tone="destructive">Cancelled</UI.StatusStamp>
      <UI.StatusStamp tone="success">ยืนยันแล้ว</UI.StatusStamp>
      <UI.StatusStamp tone="warning">รอดำเนินการตรวจสอบเนื่องจากข้อมูลไม่ครบถ้วนตามที่ระบบกำหนด</UI.StatusStamp>
    </div>
  )
}
