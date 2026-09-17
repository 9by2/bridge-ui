import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.TicketCover
      media={<UI.ResponsiveImage decorative src="https://placehold.co/720x320" />}
      metadata={<span>Caller formatted date</span>}>
      Caller ticket content
    </UI.TicketCover>
  )
}
