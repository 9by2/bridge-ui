import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Empty>
      <UI.EmptyHeader>
        <UI.EmptyTitle>No results</UI.EmptyTitle>
        <UI.EmptyDescription>Try another search.</UI.EmptyDescription>
      </UI.EmptyHeader>
    </UI.Empty>
  )
}
