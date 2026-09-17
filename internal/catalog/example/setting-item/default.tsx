import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SettingItem>
      <UI.SettingItemTitle>Notifications</UI.SettingItemTitle>
      <UI.SettingItemDescription>Caller supplied setting copy.</UI.SettingItemDescription>
      <UI.SettingItemAction>
        <button type="button">Configure</button>
      </UI.SettingItemAction>
    </UI.SettingItem>
  )
}
