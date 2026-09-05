import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Message>
      <UI.MessageAvatar>BU</UI.MessageAvatar>
      <UI.MessageContent>
        <UI.MessageHeader>Bridge UI</UI.MessageHeader>
        <UI.Bubble>
          <UI.BubbleContent>Shared message</UI.BubbleContent>
        </UI.Bubble>
        <UI.MessageFooter>Now</UI.MessageFooter>
      </UI.MessageContent>
    </UI.Message>
  )
}
