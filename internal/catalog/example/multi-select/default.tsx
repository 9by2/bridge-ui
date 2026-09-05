import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.MultiSelect defaultValues={["design"]}>
      <UI.MultiSelectTrigger aria-label="Select teams">
        <UI.MultiSelectValue placeholder="Select teams" />
      </UI.MultiSelectTrigger>
      <UI.MultiSelectContent>
        <UI.MultiSelectGroup>
          <UI.MultiSelectItem value="design">Design</UI.MultiSelectItem>
          <UI.MultiSelectItem value="engineering">Engineering</UI.MultiSelectItem>
        </UI.MultiSelectGroup>
      </UI.MultiSelectContent>
    </UI.MultiSelect>
  )
}
