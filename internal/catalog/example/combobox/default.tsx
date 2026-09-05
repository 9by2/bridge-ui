import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Combobox items={["Design", "Engineering"]}>
      <UI.ComboboxInput aria-label="Team" placeholder="Select team" showTrigger={false} />
      <UI.ComboboxTrigger aria-label="Open team options" />
      <UI.ComboboxContent>
        <UI.ComboboxList>
          {(item: string) => (
            <UI.ComboboxItem key={item} value={item}>
              {item}
            </UI.ComboboxItem>
          )}
        </UI.ComboboxList>
      </UI.ComboboxContent>
    </UI.Combobox>
  )
}
