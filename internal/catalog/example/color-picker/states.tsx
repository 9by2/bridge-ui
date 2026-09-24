import { ColorPicker, Theme } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <ColorPicker mode="fill" aria-label="Disabled" defaultValue="green" disabled />
      <ColorPicker mode="fill" aria-label="Without custom" custom={false} />
      <ColorPicker mode="fill" aria-label="Custom fill selected" defaultValue="#ff00aa" />
      <ColorPicker
        mode="gradient"
        aria-label="Custom gradient selected"
        defaultValue="repeating-radial-gradient(circle, #f43f5e 0%, #6366f1 20%)"
      />
      <Theme mode="dark">
        <div style={{ padding: 16, background: "#141414" }}>
          <ColorPicker mode="gradient" aria-label="Dark" defaultValue="electric" />
        </div>
      </Theme>
    </div>
  )
}
