import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <label className="block w-80">
      <span className="sr-only">Volume</span>
      <UI.Slider defaultValue={[40]} rangeColor="var(--bridge-color-brand)" thumbColor="var(--bridge-color-brand)" />
    </label>
  )
}
