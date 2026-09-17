import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <dl>
      <UI.DetailItem>
        <UI.DetailItemLabel>Venue name and complete street address</UI.DetailItemLabel>
        <UI.DetailItemContent>
          Impact Challenger Hall 2, Impact Muang Thong Thani, 99 Popular Road, Ban Mai, Pak Kret, Nonthaburi 11120
        </UI.DetailItemContent>
      </UI.DetailItem>
      <UI.DetailItem>
        <UI.DetailItemLabel>สถานที่จัดงาน</UI.DetailItemLabel>
        <UI.DetailItemContent>อิมแพ็ค เมืองทองธานี ฮอลล์ 5-6 ถนนแจ้งวัฒนะ</UI.DetailItemContent>
      </UI.DetailItem>
      <UI.DetailItem>
        <UI.DetailItemLabel>Note</UI.DetailItemLabel>
        <UI.DetailItemContent>—</UI.DetailItemContent>
      </UI.DetailItem>
    </dl>
  )
}
