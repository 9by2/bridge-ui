import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="w-80">
      <UI.Item>
        <UI.ItemContent>
          <UI.ItemTitle>Shared item</UI.ItemTitle>
          <UI.ItemDescription>Reusable supporting text</UI.ItemDescription>
        </UI.ItemContent>
        <UI.ItemActions>
          <UI.Button size="sm">Open</UI.Button>
        </UI.ItemActions>
      </UI.Item>
    </div>
  )
}
