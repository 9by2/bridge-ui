import { ColorPicker } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24, width: "100%", minWidth: 0 }}>
      <ColorPicker
        mode="gradient"
        kind="linear"
        aria-label="Small grid"
        size="sm"
        layout="grid"
        column={8}
        defaultValue="sky"
      />
      <ColorPicker
        mode="gradient"
        kind="linear"
        aria-label="Medium grid"
        size="md"
        layout="grid"
        column={6}
        defaultValue="violet"
      />
      <ColorPicker
        mode="gradient"
        kind="linear"
        aria-label="Large grid"
        size="lg"
        layout="grid"
        column={6}
        defaultValue="white"
      />
      <ColorPicker mode="fill" aria-label="Small row" size="sm" layout="row" defaultValue="blue" />
      <ColorPicker mode="gradient" kind="linear" aria-label="Medium row" size="md" layout="row" defaultValue="sunset" />
    </div>
  )
}
