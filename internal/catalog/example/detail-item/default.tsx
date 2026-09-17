import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <dl>
      <UI.DetailItem>
        <UI.DetailItemLabel>Venue</UI.DetailItemLabel>
        <UI.DetailItemContent>Caller supplied value</UI.DetailItemContent>
      </UI.DetailItem>
    </dl>
  )
}
