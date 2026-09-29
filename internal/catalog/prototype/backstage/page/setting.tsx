import { notify } from "@catalog-prototype/shared/console-shell"
import { SettingsLayout } from "@catalog-prototype/shared/settings-layout"
import type { ValueOf } from "@catalog-prototype/shared/support"
import { BellIcon, GlobeIcon, PaletteIcon, ShieldCheckIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

const SettingSection = {
  GENERAL: "general",
  APPEARANCE: "appearance",
  NOTIFICATION: "notification",
  INTEGRATION: "integration"
} as const
type SettingSection = ValueOf<typeof SettingSection>
const section = [
  { value: SettingSection.GENERAL, label: "General", icon: ShieldCheckIcon },
  { value: SettingSection.APPEARANCE, label: "Appearance", icon: PaletteIcon },
  { value: SettingSection.NOTIFICATION, label: "Notification", icon: BellIcon },
  { value: SettingSection.INTEGRATION, label: "Integration", icon: GlobeIcon }
] as const
const timezone = ["Asia/Bangkok", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "America/New_York"]

function General() {
  const [dirty, setDirty] = useState(false)
  return (
    <>
      {dirty ? (
        <UI.StickyAlert tone="warning" offset="4rem">
          You have unsaved change.{" "}
          <UI.Button size="sm" onClick={() => (setDirty(false), notify.success("Setting saved"))}>
            Save
          </UI.Button>
        </UI.StickyAlert>
      ) : null}
      <UI.SettingItem>
        <UI.SettingItemTitle>Studio name</UI.SettingItemTitle>
        <UI.SettingItemDescription>Shown on statement and ticket.</UI.SettingItemDescription>
        <UI.SettingItemAction>
          <UI.Input aria-label="Studio name" defaultValue="Bridge Studio" onChange={() => setDirty(true)} />
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem>
        <UI.SettingItemTitle>Time zone</UI.SettingItemTitle>
        <UI.SettingItemDescription>Used for schedule and payout cut-off.</UI.SettingItemDescription>
        <UI.SettingItemAction>
          <UI.Combobox items={timezone} defaultValue="Asia/Bangkok" onValueChange={() => setDirty(true)}>
            <UI.ComboboxInput aria-label="Time zone" placeholder="Search time zone" />
            <UI.ComboboxContent>
              <UI.ComboboxEmpty>No time zone found.</UI.ComboboxEmpty>
              <UI.ComboboxList>
                {(item: string) => (
                  <UI.ComboboxItem key={item} value={item}>
                    {item}
                  </UI.ComboboxItem>
                )}
              </UI.ComboboxList>
            </UI.ComboboxContent>
          </UI.Combobox>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem>
        <UI.SettingItemTitle>Currency</UI.SettingItemTitle>
        <UI.SettingItemAction>
          <UI.Select defaultValue="thb" onValueChange={() => setDirty(true)}>
            <UI.SelectTrigger aria-label="Currency">
              <UI.SelectValue />
            </UI.SelectTrigger>
            <UI.SelectContent>
              <UI.SelectGroup>
                <UI.SelectLabel>Asia</UI.SelectLabel>
                <UI.SelectItem value="thb">THB · Thai baht</UI.SelectItem>
                <UI.SelectItem value="jpy">JPY · Japanese yen</UI.SelectItem>
              </UI.SelectGroup>
              <UI.SelectSeparator />
              <UI.SelectItem value="usd">USD · US dollar</UI.SelectItem>
            </UI.SelectContent>
          </UI.Select>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem>
        <UI.SettingItemTitle>Delete studio</UI.SettingItemTitle>
        <UI.SettingItemDescription>Remove every roster, event and statement permanently.</UI.SettingItemDescription>
        <UI.SettingItemAction>
          <UI.AlertDialog>
            <UI.AlertDialogTrigger render={<UI.Button variant="destructive" />}>Delete</UI.AlertDialogTrigger>
            <UI.AlertDialogContent>
              <UI.AlertDialogHeader>
                <UI.AlertDialogMedia>
                  <ShieldCheckIcon aria-hidden="true" />
                </UI.AlertDialogMedia>
                <UI.AlertDialogTitle>Delete Bridge Studio?</UI.AlertDialogTitle>
                <UI.AlertDialogDescription>This cannot be undone.</UI.AlertDialogDescription>
              </UI.AlertDialogHeader>
              <UI.AlertDialogFooter>
                <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
                <UI.AlertDialogAction onClick={() => notify.info("Delete blocked in prototype")}>
                  Delete
                </UI.AlertDialogAction>
              </UI.AlertDialogFooter>
            </UI.AlertDialogContent>
          </UI.AlertDialog>
        </UI.SettingItemAction>
      </UI.SettingItem>
    </>
  )
}

function Appearance() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <UI.Muted>Every preview below renders the same Button with a nested Theme boundary.</UI.Muted>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <UI.Theme>
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Default</UI.CardTitle>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.Button>Continue</UI.Button>
            </UI.CardContent>
          </UI.Card>
        </UI.Theme>
        <UI.Theme density={UI.bridgeDensity.compact}>
          <UI.Card>
            <UI.CardHeader>
              <UI.CardTitle>Compact</UI.CardTitle>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.Button>Continue</UI.Button>
            </UI.CardContent>
          </UI.Card>
        </UI.Theme>
        <UI.DirectionProvider direction="rtl">
          <div dir="rtl">
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>RTL</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.Button>متابعة</UI.Button>
              </UI.CardContent>
            </UI.Card>
          </div>
        </UI.DirectionProvider>
      </div>
    </div>
  )
}

function Notification() {
  return (
    <>
      {[
        ["Payout ready", "Email when a musician statement is ready.", true],
        ["Queue failure", "Push when a Backstage import fails.", true],
        ["Weekly digest", "Summary every Monday 09:00.", false]
      ].map(([title, description, checked]) => (
        <UI.SettingItem key={String(title)}>
          <UI.SettingItemTitle>{title}</UI.SettingItemTitle>
          <UI.SettingItemDescription>{description}</UI.SettingItemDescription>
          <UI.SettingItemAction>
            <UI.Switch aria-label={String(title)} defaultChecked={checked === true} />
          </UI.SettingItemAction>
        </UI.SettingItem>
      ))}
    </>
  )
}

function Integration() {
  return (
    <UI.DataState variant="permission">
      <UI.DataStateTitle>Owner access required</UI.DataStateTitle>
      <UI.DataStateDescription>Only a studio owner can connect a distributor account.</UI.DataStateDescription>
      <UI.DataStateAction>
        <UI.Button variant="outline" onClick={() => notify.info("Access requested")}>
          Request access
        </UI.Button>
      </UI.DataStateAction>
    </UI.DataState>
  )
}

export function SettingPage() {
  const [current, setCurrent] = useState<SettingSection>(SettingSection.GENERAL)
  return (
    <SettingsLayout owner="Bridge Studio" initial="BS" section={section} current={current} onCurrentChange={setCurrent}>
      {current === SettingSection.GENERAL ? <General /> : null}
      {current === SettingSection.APPEARANCE ? <Appearance /> : null}
      {current === SettingSection.NOTIFICATION ? <Notification /> : null}
      {current === SettingSection.INTEGRATION ? <Integration /> : null}
    </SettingsLayout>
  )
}
