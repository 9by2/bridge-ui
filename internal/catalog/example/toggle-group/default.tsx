import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ToggleGroup defaultValue={["left"]}>
      <UI.ToggleGroupItem value="left">Left</UI.ToggleGroupItem>
      <UI.ToggleGroupItem value="right">Right</UI.ToggleGroupItem>
    </UI.ToggleGroup>
  )
}
