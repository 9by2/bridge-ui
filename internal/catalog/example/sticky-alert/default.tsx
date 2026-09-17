import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.StickyAlert tone="warning" offset="1rem">
      Caller-provided alert content
    </UI.StickyAlert>
  )
}
