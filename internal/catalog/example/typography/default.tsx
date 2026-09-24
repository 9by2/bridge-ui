import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <UI.Heading as={UI.WAIHeading.H1}>Dashboard ภาพรวมผู้สมัคร</UI.Heading>
      <UI.Heading as={UI.WAIHeading.H2}>Pipeline การสรรหา Q3</UI.Heading>
      <UI.Heading as={UI.WAIHeading.H3}>Interview นัดหมายสัปดาห์นี้</UI.Heading>
      <UI.Heading>Candidate ที่รอ Review</UI.Heading>
      <UI.TypographyLabel>Status สถานะ</UI.TypographyLabel>
      <UI.Body>Bridge ช่วยให้ทีม HR ติดตาม candidate ได้ในที่เดียว พร้อม report สรุปผลการ interview แบบ real-time</UI.Body>
    </div>
  )
}
