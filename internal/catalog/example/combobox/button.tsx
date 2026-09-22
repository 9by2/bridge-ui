import * as UI from "@bridge/ui"

const Team = ["Design", "Engineering", "Product"]

export default function Example() {
  return (
    <UI.Combobox items={Team}>
      <UI.ComboboxButton>Select team</UI.ComboboxButton>
      <UI.ComboboxContent>
        <UI.ComboboxList>
          <UI.ComboboxCollection>
            {(team: string) => <UI.ComboboxItem value={team}>{team}</UI.ComboboxItem>}
          </UI.ComboboxCollection>
        </UI.ComboboxList>
      </UI.ComboboxContent>
    </UI.Combobox>
  )
}
