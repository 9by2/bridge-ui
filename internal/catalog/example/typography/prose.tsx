import * as UI from "@bridge/ui"

const list = [
  { name: "Change", ordered: false, entry: ["Sonner toast export ใหม่", "Page density และ width preset"] },
  { name: "Step", ordered: true, entry: ["เปิด branch จาก main", "เขียน test ก่อน implementation"] }
] as const

const status = {
  head: ["Component", "สถานะ"],
  row: [["Spinner", "พร้อมใช้งาน"]]
} as const

export default function Example() {
  return (
    <article className="grid max-w-2xl gap-4">
      <UI.Heading as={UI.WAIHeading.H2}>Release note บันทึกการเปลี่ยนแปลง</UI.Heading>
      <UI.Lead>สรุป release ประจำสัปดาห์ สำหรับทีม product และ engineering</UI.Lead>
      <UI.Body>
        Run <UI.InlineCode>bun test</UI.InlineCode> ก่อน push ทุกครั้ง และตรวจ{" "}
        <UI.InlineCode>coverage:runtime</UI.InlineCode>
      </UI.Body>
      <UI.Blockquote>“Ship small, verify in the browser.” ทำทีละน้อยแต่ตรวจให้ครบ</UI.Blockquote>
      {list.map((item) => (
        <UI.List key={item.name} ordered={item.ordered} aria-label={item.name}>
          {item.entry.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </UI.List>
      ))}
      <UI.Large>12 component updated</UI.Large>
      <UI.Small>อัปเดตล่าสุด 24 Sep 2026</UI.Small>
      <UI.Muted>Prose tables reuse the existing Table export.</UI.Muted>
      <UI.Table>
        <UI.TableHeader>
          <UI.TableRow>
            {status.head.map((cell) => (
              <UI.TableHead key={cell}>{cell}</UI.TableHead>
            ))}
          </UI.TableRow>
        </UI.TableHeader>
        <UI.TableBody>
          {status.row.map(([name, value]) => (
            <UI.TableRow key={name}>
              <UI.TableCell>{name}</UI.TableCell>
              <UI.TableCell>{value}</UI.TableCell>
            </UI.TableRow>
          ))}
        </UI.TableBody>
      </UI.Table>
    </article>
  )
}
