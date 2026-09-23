import { useState } from "react"

import { ColorPicker, type ColorPickerOption } from "@bridge/ui"

const option: ColorPickerOption[] = [
  { type: "fill", value: "ink", label: "หมึก", color: "#111827" },
  { type: "fill", value: "paper", label: "กระดาษ", color: "#f8fafc" },
  { type: "gradient", value: "dawn", label: "รุ่งอรุณ", stop: ["#f97316", "#facc15"] },
  { type: "gradient", value: "dusk", label: "สนธยา", stop: ["#1e3a8a", "#7c3aed", "#db2777"], angle: 90 },
  { type: "gradient", value: "glow", label: "เรืองแสง", stop: ["#fde68a", "#f97316"], shape: "radial" }
]

export default function Example() {
  const [value, setValue] = useState("dawn")
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <ColorPicker
        aria-label="สีพื้นหลัง"
        option={option}
        value={value}
        onValueChange={setValue}
        customLabel="กำหนดสีเอง"
        colorLabel="เลือกสี"
        hexLabel="รหัสสี"
      />
      <output>{value}</output>
    </div>
  )
}
