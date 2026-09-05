import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.RadioGroup defaultValue="one">
      <label className="flex gap-2">
        <UI.RadioGroupItem value="one" />
        One
      </label>
      <label className="flex gap-2">
        <UI.RadioGroupItem value="two" />
        Two
      </label>
    </UI.RadioGroup>
  )
}
