import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.HoverCard>
      <UI.HoverCardTrigger render={<a href="#profile">Bridge UI</a>} />
      <UI.HoverCardContent>Shared component profile</UI.HoverCardContent>
    </UI.HoverCard>
  )
}
