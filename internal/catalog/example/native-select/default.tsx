import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.NativeSelect aria-label="Team">
      <UI.NativeSelectOption value="design">Design</UI.NativeSelectOption>
      <UI.NativeSelectOption value="engineering">Engineering</UI.NativeSelectOption>
    </UI.NativeSelect>
  )
}
