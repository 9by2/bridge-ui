import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="grid gap-2">
        <UI.Label>Genre (width full)</UI.Label>
        <UI.MultiSelect defaultValues={["jazz"]}>
          <UI.MultiSelectTrigger aria-label="Genre" width="full">
            <UI.MultiSelectValue placeholder="Select genres" />
          </UI.MultiSelectTrigger>
          <UI.MultiSelectContent>
            <UI.MultiSelectGroup>
              <UI.MultiSelectItem value="jazz">Jazz</UI.MultiSelectItem>
              <UI.MultiSelectItem value="pop">Pop</UI.MultiSelectItem>
              <UI.MultiSelectItem value="rock">Rock</UI.MultiSelectItem>
            </UI.MultiSelectGroup>
          </UI.MultiSelectContent>
        </UI.MultiSelect>
      </div>
      <div className="grid gap-2">
        <UI.Label>Team (default intrinsic)</UI.Label>
        <UI.MultiSelect>
          <UI.MultiSelectTrigger aria-label="Team">
            <UI.MultiSelectValue placeholder="Select teams" />
          </UI.MultiSelectTrigger>
          <UI.MultiSelectContent>
            <UI.MultiSelectGroup>
              <UI.MultiSelectItem value="design">Design</UI.MultiSelectItem>
              <UI.MultiSelectItem value="engineering">Engineering</UI.MultiSelectItem>
            </UI.MultiSelectGroup>
          </UI.MultiSelectContent>
        </UI.MultiSelect>
      </div>
    </div>
  )
}
