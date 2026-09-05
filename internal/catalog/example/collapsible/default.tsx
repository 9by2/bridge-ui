import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Collapsible>
      <UI.CollapsibleTrigger render={<UI.Button />}>Details</UI.CollapsibleTrigger>
      <UI.CollapsibleContent>Shared details</UI.CollapsibleContent>
    </UI.Collapsible>
  )
}
