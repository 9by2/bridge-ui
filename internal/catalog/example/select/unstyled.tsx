import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Select defaultValue="member">
      <UI.SelectTrigger appearance="unstyled" aria-label="Role">
        <UI.SelectValue />
      </UI.SelectTrigger>
      <UI.SelectContent>
        <UI.SelectItem value="admin">Admin</UI.SelectItem>
        <UI.SelectItem value="member">Member</UI.SelectItem>
      </UI.SelectContent>
    </UI.Select>
  )
}
