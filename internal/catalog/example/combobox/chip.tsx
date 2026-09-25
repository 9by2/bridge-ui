import * as UI from "@bridge/ui"

const tags = ["Jazz", "Pop", "Rock", "Soul"]

export default function Example() {
  const anchor = UI.useComboboxAnchor()
  return (
    <UI.Combobox multiple items={tags} defaultValue={["Jazz", "Soul"]}>
      <UI.ComboboxChips ref={anchor}>
        <UI.ComboboxValue>
          {(selected: string[]) =>
            selected.map((tag) => (
              <UI.ComboboxChip key={tag} removeLabel={`Remove ${tag}`}>
                {tag}
              </UI.ComboboxChip>
            ))
          }
        </UI.ComboboxValue>
        <UI.ComboboxChipsInput aria-label="Tags" placeholder="Add tag" />
      </UI.ComboboxChips>
      <UI.ComboboxContent anchor={anchor}>
        <UI.ComboboxList>
          {(tag: string) => (
            <UI.ComboboxItem key={tag} value={tag}>
              {tag}
            </UI.ComboboxItem>
          )}
        </UI.ComboboxList>
      </UI.ComboboxContent>
    </UI.Combobox>
  )
}
