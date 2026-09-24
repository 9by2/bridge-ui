import { useState } from "react"

import { ColorPicker, type ColorPickerFillOption } from "@bridge/ui"

// Composition layer: product payload -> fill option. The picker only ever receives `mode="fill"`.
type ProductTextColor = { id: string; name: string; hex: string }

const payload: ProductTextColor[] = [
  { id: "ink", name: "หมึก", hex: "#111827" },
  { id: "paper", name: "กระดาษ", hex: "#f8fafc" },
  { id: "brand", name: "แบรนด์", hex: "#10b981" },
  { id: "alert", name: "เตือน", hex: "#ef4444" }
]
const option: ColorPickerFillOption[] = payload.map((item) => ({
  type: "fill",
  value: item.id,
  label: item.name,
  color: item.hex
}))

export default function Example() {
  const [value, setValue] = useState("ink")
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <ColorPicker
        mode="fill"
        aria-label="สีตัวอักษร"
        option={option}
        value={value}
        onValueChange={setValue}
        label={{ custom: "กำหนดสีเอง", color: "เลือกสี", hex: "รหัสสี" }}
      />
      <output>{value}</output>
    </div>
  )
}
