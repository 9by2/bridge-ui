import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.MultiSelect defaultValues={["design"]}>
      <UI.MultiSelectTrigger aria-label="Select teams">
        <UI.MultiSelectValue placeholder="Select teams" />
      </UI.MultiSelectTrigger>
      <UI.MultiSelectContent>
        <UI.MultiSelectGroup heading="Product">
          <UI.MultiSelectItem value="design">Design</UI.MultiSelectItem>
          <UI.MultiSelectItem value="research">Research</UI.MultiSelectItem>
        </UI.MultiSelectGroup>
        <UI.MultiSelectSeparator />
        <UI.MultiSelectGroup heading="Platform">
          <UI.MultiSelectItem value="engineering">Engineering</UI.MultiSelectItem>
        </UI.MultiSelectGroup>
      </UI.MultiSelectContent>
    </UI.MultiSelect>
  )
}
