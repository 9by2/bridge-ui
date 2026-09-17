import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <>
      <UI.SettingItem>
        <UI.SettingItemTitle>Push notification preferences and delivery schedule</UI.SettingItemTitle>
        <UI.SettingItemDescription>
          Caller supplied long-form description explaining exactly when and how notifications are delivered across every
          connected device.
        </UI.SettingItemDescription>
        <UI.SettingItemAction>
          <button type="button">Configure</button>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem>
        <UI.SettingItemTitle>การแจ้งเตือน</UI.SettingItemTitle>
        <UI.SettingItemDescription>ตั้งค่าการแจ้งเตือนสำหรับการซื้อบัตรและกิจกรรมที่ติดตาม</UI.SettingItemDescription>
        <UI.SettingItemAction>
          <button type="button" disabled>
            Configure
          </button>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem>
        <UI.SettingItemTitle>Minimal setting</UI.SettingItemTitle>
      </UI.SettingItem>
    </>
  )
}
