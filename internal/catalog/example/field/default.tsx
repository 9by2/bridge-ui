import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Field>
      <UI.FieldLabel htmlFor="email">Email</UI.FieldLabel>
      <UI.Input id="email" />
    </UI.Field>
  )
}
