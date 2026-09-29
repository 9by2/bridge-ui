import { RichContent } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ maxWidth: "22rem", border: "1px dashed currentColor", padding: "0.75rem" }}>
      <RichContent
        variant="compact"
        content={[
          { type: "heading", level: 3, children: [{ type: "text", text: "ประกาศสำหรับผู้ใช้มือถือ" }] },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "ข้อความยาวภาษาไทยที่ต้องตัดบรรทัดได้อย่างถูกต้องบนหน้าจอแคบ และลิงก์ยาว "
              },
              {
                type: "text",
                text: "https://example.org/a/very/long/path/that/must/wrap/on/mobile",
                href: "https://example.org/a/very/long/path/that/must/wrap/on/mobile",
                external: true
              }
            ]
          },
          { type: "codeBlock", code: "bun run build && bun run verify:package --with-a-long-flag" },
          {
            type: "table",
            rows: [
              {
                cells: [
                  { header: true, children: [{ type: "text", text: "รายการ" }] },
                  { header: true, children: [{ type: "text", text: "ราคา" }] },
                  { header: true, children: [{ type: "text", text: "หมายเหตุ" }] }
                ]
              },
              {
                cells: [
                  { children: [{ type: "text", text: "แพ็กเกจเริ่มต้น" }] },
                  { children: [{ type: "text", text: "฿290" }] },
                  { children: [{ type: "text", text: "ต่อผู้ใช้ต่อเดือน" }] }
                ]
              }
            ]
          }
        ]}
      />
    </div>
  )
}
