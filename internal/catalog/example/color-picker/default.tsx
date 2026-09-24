import { ColorPicker, Label } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Label id="color-picker-background">Background</Label>
      <ColorPicker
        mode="gradient"
        kind="linear"
        aria-labelledby="color-picker-background"
        size="lg"
        layout="grid"
        column={6}
        defaultValue="white"
      />
    </div>
  )
}
