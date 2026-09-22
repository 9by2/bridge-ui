import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <label>
      <span className="sr-only">Volume</span>
      <UI.Slider
        defaultValue={[40]}
        rangeColor="var(--bridge-color-brand)"
        thumbColor="var(--bridge-color-brand)"
        className="w-80"
      />
    </label>
  )
}
