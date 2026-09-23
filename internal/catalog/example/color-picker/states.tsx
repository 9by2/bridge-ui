import { ColorPicker, colorPickerPreset, Theme } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <ColorPicker aria-label="Disabled" size="md" option={colorPickerPreset.fill} defaultValue="green" disabled />
      <ColorPicker aria-label="Without custom" size="md" option={colorPickerPreset.fill} custom={false} />
      <ColorPicker
        aria-label="Custom value selected"
        size="md"
        option={colorPickerPreset.fill}
        defaultValue="#ff00aa"
      />
      <Theme mode="dark">
        <div style={{ padding: 16, background: "#141414" }}>
          <ColorPicker aria-label="Dark" size="md" defaultValue="electric" />
        </div>
      </Theme>
    </div>
  )
}
