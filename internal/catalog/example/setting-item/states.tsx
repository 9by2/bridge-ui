import { PencilIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <>
      <UI.SettingItem variant="inline">
        <UI.SettingItemTitle>Username</UI.SettingItemTitle>
        <UI.SettingItemAction>
          alexsmith.mob
          <UI.Button aria-label="Edit username" size="icon-sm" variant="ghost">
            <PencilIcon aria-hidden="true" />
          </UI.Button>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem variant="inline">
        <UI.SettingItemTitle>Display name</UI.SettingItemTitle>
        <UI.SettingItemAction>
          Alex Smith
          <UI.Button aria-label="Edit display name" size="icon-sm" variant="ghost">
            <PencilIcon aria-hidden="true" />
          </UI.Button>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem variant="inline">
        <UI.SettingItemTitle>Email</UI.SettingItemTitle>
        <UI.SettingItemAction>
          alexsmith.mobbin@gmail.com
          <UI.Button aria-label="Edit email" size="icon-sm" variant="ghost">
            <PencilIcon aria-hidden="true" />
          </UI.Button>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem variant="inline">
        <UI.SettingItemTitle>Language</UI.SettingItemTitle>
        <UI.SettingItemDescription>Used for the workspace interface.</UI.SettingItemDescription>
        <UI.SettingItemAction>
          English (US)
          <UI.Button aria-label="Edit language" size="icon-sm" variant="ghost">
            <PencilIcon aria-hidden="true" />
          </UI.Button>
        </UI.SettingItemAction>
      </UI.SettingItem>
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
