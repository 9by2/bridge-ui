import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <label className="flex items-center gap-2">
      <UI.Checkbox aria-label="Accept terms" /> Accept terms
    </label>
  )
}
