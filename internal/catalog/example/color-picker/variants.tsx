import { ColorPicker, colorPickerPreset } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24, width: "100%", minWidth: 0 }}>
      <ColorPicker aria-label="Small grid" size="sm" layout="grid" column={8} defaultValue="sky" />
      <ColorPicker aria-label="Medium grid" size="md" layout="grid" column={6} defaultValue="violet" />
      <ColorPicker aria-label="Large grid" size="lg" layout="grid" column={6} defaultValue="white" />
      <ColorPicker aria-label="Small row" size="sm" layout="row" option={colorPickerPreset.fill} defaultValue="blue" />
      <ColorPicker aria-label="Medium row" size="md" layout="row" defaultValue="sunset" />
    </div>
  )
}
