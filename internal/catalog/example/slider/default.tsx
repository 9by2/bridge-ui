import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <label>
      <span className="sr-only">Volume</span>
      <UI.Slider defaultValue={[40]} className="w-80" />
    </label>
  )
}
