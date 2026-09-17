import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.TicketCard defaultSide="front" frontLabel="Show front" backLabel="Show back">
      <UI.TicketCardFront>Caller front content</UI.TicketCardFront>
      <UI.TicketCardBack>Caller back content</UI.TicketCardBack>
    </UI.TicketCard>
  )
}
