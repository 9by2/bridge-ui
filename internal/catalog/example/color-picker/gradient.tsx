import { useState } from "react"

import { ColorPicker, Label, type ColorPickerGradientKind, type ColorPickerGradientOption } from "@bridge/ui"

// Composition layer: each product surface declares ONE gradient kind and maps its payload into that shape.
type ThemePayload = { id: string; name: string; stop: string[] }

const payload: ThemePayload[] = [
  { id: "dawn", name: "Dawn", stop: ["#f97316", "#facc15"] },
  { id: "dusk", name: "Dusk", stop: ["#1e3a8a", "#7c3aed", "#db2777"] },
  { id: "lagoon", name: "Lagoon", stop: ["#a5f3fc", "#0e7490"] },
  { id: "spectrum", name: "Spectrum", stop: ["#ef4444", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ef4444"] }
]

function toOption(kind: ColorPickerGradientKind): ColorPickerGradientOption[] {
  return payload.map((item) => ({ type: "gradient", value: item.id, label: item.name, kind, stop: item.stop }))
}

const surface = [
  { kind: "linear", title: "Banner (linear)", option: toOption("linear") },
  { kind: "radial", title: "Spotlight (radial)", option: toOption("radial") },
  { kind: "conic", title: "Badge ring (conic)", option: toOption("conic") }
] as const satisfies readonly { kind: ColorPickerGradientKind; title: string; option: ColorPickerGradientOption[] }[]

function Surface({ kind, title, option }: (typeof surface)[number]) {
  // Persist the CSS string; it reopens in the editor via colorPickerParse.
  const [value, setValue] = useState("dawn")
  const id = `color-picker-${kind}`
  return (
    <div style={{ display: "grid", gap: 8, maxWidth: "100%" }}>
      <Label id={id}>{title}</Label>
      <ColorPicker
        mode="gradient"
        kind={kind}
        aria-labelledby={id}
        option={option}
        value={value}
        onValueChange={setValue}
      />
      <output style={{ fontFamily: "monospace", fontSize: 12, overflowWrap: "anywhere" }}>{value}</output>
    </div>
  )
}

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24, maxWidth: "100%" }}>
      {surface.map((item) => (
        <Surface key={item.kind} {...item} />
      ))}
    </div>
  )
}
