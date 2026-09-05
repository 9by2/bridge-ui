import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.AlertDialog>
      <UI.AlertDialogTrigger render={<UI.Button />}>Delete</UI.AlertDialogTrigger>
      <UI.AlertDialogContent>
        <UI.AlertDialogHeader>
          <UI.AlertDialogTitle>Delete item?</UI.AlertDialogTitle>
          <UI.AlertDialogDescription>This action cannot be undone.</UI.AlertDialogDescription>
        </UI.AlertDialogHeader>
        <UI.AlertDialogFooter>
          <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
          <UI.AlertDialogAction>Continue</UI.AlertDialogAction>
        </UI.AlertDialogFooter>
      </UI.AlertDialogContent>
    </UI.AlertDialog>
  )
}
