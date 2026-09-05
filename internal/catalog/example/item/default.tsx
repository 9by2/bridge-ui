import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Item className="w-80">
      <UI.ItemContent>
        <UI.ItemTitle>Shared item</UI.ItemTitle>
        <UI.ItemDescription>Reusable supporting text</UI.ItemDescription>
      </UI.ItemContent>
      <UI.ItemActions>
        <UI.Button size="sm">Open</UI.Button>
      </UI.ItemActions>
    </UI.Item>
  )
}
