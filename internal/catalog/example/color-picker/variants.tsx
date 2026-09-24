import { ColorPicker } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24, width: "100%", minWidth: 0 }}>
      <ColorPicker mode="gradient" aria-label="Small grid" size="sm" layout="grid" column={8} defaultValue="sky" />
      <ColorPicker mode="gradient" aria-label="Medium grid" size="md" layout="grid" column={6} defaultValue="violet" />
      <ColorPicker mode="gradient" aria-label="Large grid" size="lg" layout="grid" column={6} defaultValue="white" />
      <ColorPicker mode="fill" aria-label="Small row" size="sm" layout="row" defaultValue="blue" />
      <ColorPicker mode="gradient" aria-label="Medium row" size="md" layout="row" defaultValue="sunset" />
    </div>
  )
}
