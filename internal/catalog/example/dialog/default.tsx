import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Dialog>
      <UI.DialogTrigger render={<UI.Button />}>Open dialog</UI.DialogTrigger>
      <UI.DialogContent>
        <UI.DialogHeader>
          <UI.DialogTitle>Shared dialog</UI.DialogTitle>
          <UI.DialogDescription>Reusable content</UI.DialogDescription>
        </UI.DialogHeader>
      </UI.DialogContent>
    </UI.Dialog>
  )
}
