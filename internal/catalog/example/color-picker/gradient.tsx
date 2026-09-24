import { useState } from "react"

import { ColorPicker, type ColorPickerGradientOption } from "@bridge/ui"

// Composition layer: product payload -> gradient option. Every CSS gradient function is declared explicitly.
const option: ColorPickerGradientOption[] = [
  { type: "gradient", value: "dawn", label: "Dawn (linear)", kind: "linear", angle: 135, stop: ["#f97316", "#facc15"] },
  {
    type: "gradient",
    value: "dusk",
    label: "Dusk (linear, 3 stop)",
    kind: "linear",
    angle: 90,
    stop: ["#1e3a8a", { color: "#7c3aed", position: 40 }, "#db2777"]
  },
  {
    type: "gradient",
    value: "glow",
    label: "Glow (radial circle)",
    kind: "radial",
    shape: "circle",
    stop: ["#fde68a", "#f97316"]
  },
  {
    type: "gradient",
    value: "halo",
    label: "Halo (radial ellipse)",
    kind: "radial",
    shape: "ellipse",
    stop: ["#a5f3fc", "#0e7490"]
  },
  {
    type: "gradient",
    value: "wheel",
    label: "Wheel (conic)",
    kind: "conic",
    angle: 0,
    stop: ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ef4444"]
  },
  {
    type: "gradient",
    value: "stripe",
    label: "Stripe (repeating linear)",
    kind: "linear",
    angle: 45,
    repeating: true,
    stop: [
      { color: "#0f172a", position: 0 },
      { color: "#0f172a", position: 10 },
      { color: "#334155", position: 10 },
      { color: "#334155", position: 20 }
    ]
  }
]

export default function Example() {
  // Persist the CSS string; it reopens in the editor via colorPickerParse.
  const [value, setValue] = useState("dawn")
  return (
    <div style={{ display: "grid", gap: 12, maxWidth: "100%" }}>
      <ColorPicker mode="gradient" aria-label="Background" option={option} value={value} onValueChange={setValue} />
      <output style={{ fontFamily: "monospace", fontSize: 12, overflowWrap: "anywhere" }}>{value}</output>
    </div>
  )
}
