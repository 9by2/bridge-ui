import { BellIcon, PaletteIcon, ShieldCheckIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

const SettingsSection = {
  GENERAL: "general",
  APPEARANCE: "appearance",
  NOTIFICATION: "notification"
} as const

type SettingsSection = (typeof SettingsSection)[keyof typeof SettingsSection]

const SettingsConfig = {
  [SettingsSection.GENERAL]: { label: "General", icon: ShieldCheckIcon },
  [SettingsSection.APPEARANCE]: { label: "Appearance", icon: PaletteIcon },
  [SettingsSection.NOTIFICATION]: { label: "Notifications", icon: BellIcon }
} as const

const SettingsNavigation = [
  { value: SettingsSection.GENERAL, ...SettingsConfig[SettingsSection.GENERAL] },
  { value: SettingsSection.APPEARANCE, ...SettingsConfig[SettingsSection.APPEARANCE] },
  { value: SettingsSection.NOTIFICATION, ...SettingsConfig[SettingsSection.NOTIFICATION] }
] as const

export default function Example() {
  const [section, setSection] = useState<SettingsSection>(SettingsSection.GENERAL)
  const [timezone, setTimezone] = useState("Asia/Bangkok")
  const [timezoneDialogOpen, setTimezoneDialogOpen] = useState(false)
  const [editingLanguage, setEditingLanguage] = useState(false)
  const [language, setLanguage] = useState("English")
  const [draftLanguage, setDraftLanguage] = useState(language)
  const [resetComplete, setResetComplete] = useState(false)
  const current = SettingsConfig[section]
  return (
    <div className="mx-auto w-full overflow-hidden border bg-background" style={{ maxWidth: 880 }}>
      <UI.Settings>
        <UI.SettingsSidebar title={current.label}>
          <UI.SettingsSidebarHeader>
            <UI.Avatar size="sm">
              <UI.AvatarFallback>NW</UI.AvatarFallback>
            </UI.Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">Nara W.</span>
              <span className="block truncate text-xs text-muted-foreground">Administrator</span>
            </span>
          </UI.SettingsSidebarHeader>
          {SettingsNavigation.map((item) => {
            const Icon = item.icon
            return (
              <UI.SettingsNavItem
                key={item.value}
                isActive={section === item.value}
                onClick={() => setSection(item.value)}>
                <Icon className="mr-2 size-4" />
                {item.label}
              </UI.SettingsNavItem>
            )
          })}
        </UI.SettingsSidebar>
        <UI.SettingsContent aria-label={`${current.label} settings`}>
          <h2 className="m-0 text-xl font-semibold">{current.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose how the workspace works for you.</p>
          <div className="mt-5">
            <UI.SettingItem>
              <UI.SettingItemTitle>Email updates</UI.SettingItemTitle>
              <UI.SettingItemDescription>Receive a summary of important workspace activity.</UI.SettingItemDescription>
              <UI.SettingItemAction>
                <UI.Switch aria-label="Email updates" defaultChecked />
              </UI.SettingItemAction>
            </UI.SettingItem>
            <UI.SettingItem>
              <UI.SettingItemTitle>Product announcements</UI.SettingItemTitle>
              <UI.SettingItemDescription>Hear about new capabilities and improvements.</UI.SettingItemDescription>
              <UI.SettingItemAction>
                <UI.Switch aria-label="Product announcements" />
              </UI.SettingItemAction>
            </UI.SettingItem>
            <UI.SettingItem>
              <UI.SettingItemTitle>Time zone</UI.SettingItemTitle>
              <UI.SettingItemDescription>
                Used for dates, schedules, and notification delivery.
              </UI.SettingItemDescription>
              <UI.SettingItemAction>
                <UI.Dialog open={timezoneDialogOpen} onOpenChange={setTimezoneDialogOpen}>
                  <UI.DialogTrigger render={<UI.Button variant="outline" />}>{timezone}</UI.DialogTrigger>
                  <UI.DialogContent>
                    <UI.Command>
                      <UI.CommandInput placeholder="Search time zones" />
                      <UI.CommandList>
                        <UI.CommandEmpty>No time zone found.</UI.CommandEmpty>
                        <UI.CommandGroup heading="Suggested">
                          {["Asia/Bangkok", "Asia/Tokyo", "Europe/London", "America/New_York"].map((value) => (
                            <UI.CommandItem
                              key={value}
                              value={value}
                              onSelect={() => {
                                setTimezone(value)
                                setTimezoneDialogOpen(false)
                              }}>
                              {value}
                            </UI.CommandItem>
                          ))}
                        </UI.CommandGroup>
                      </UI.CommandList>
                    </UI.Command>
                  </UI.DialogContent>
                </UI.Dialog>
              </UI.SettingItemAction>
            </UI.SettingItem>
            <UI.SettingItem>
              <UI.SettingItemTitle>Language</UI.SettingItemTitle>
              <UI.SettingItemDescription>Controls language used for the workspace interface.</UI.SettingItemDescription>
              <UI.SettingItemAction>
                {editingLanguage ? (
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault()
                      setLanguage(draftLanguage)
                      setEditingLanguage(false)
                    }}>
                    <UI.NativeSelect
                      aria-label="Language"
                      value={draftLanguage}
                      onChange={(event) => setDraftLanguage(event.target.value)}>
                      <UI.NativeSelectOption value="English">English</UI.NativeSelectOption>
                      <UI.NativeSelectOption value="Thai">Thai</UI.NativeSelectOption>
                      <UI.NativeSelectOption value="Japanese">Japanese</UI.NativeSelectOption>
                    </UI.NativeSelect>
                    <UI.Button size="sm" type="submit">
                      Save
                    </UI.Button>
                    <UI.Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setDraftLanguage(language)
                        setEditingLanguage(false)
                      }}>
                      Cancel
                    </UI.Button>
                  </form>
                ) : (
                  <UI.Button size="sm" variant="outline" onClick={() => setEditingLanguage(true)}>
                    {language}
                  </UI.Button>
                )}
              </UI.SettingItemAction>
            </UI.SettingItem>
            <UI.SettingItem>
              <UI.SettingItemTitle>Reset workspace preferences</UI.SettingItemTitle>
              <UI.SettingItemDescription>
                Restore every local workspace preference to its default value.
              </UI.SettingItemDescription>
              <UI.SettingItemAction>
                <UI.AlertDialog>
                  <UI.AlertDialogTrigger render={<UI.Button size="sm" variant="destructive" />}>
                    Reset
                  </UI.AlertDialogTrigger>
                  <UI.AlertDialogContent>
                    <UI.AlertDialogHeader>
                      <UI.AlertDialogTitle>Reset workspace preferences?</UI.AlertDialogTitle>
                      <UI.AlertDialogDescription>
                        This removes your saved preference choices and cannot be undone.
                      </UI.AlertDialogDescription>
                    </UI.AlertDialogHeader>
                    <UI.AlertDialogFooter>
                      <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
                      <UI.AlertDialogAction onClick={() => setResetComplete(true)}>
                        Reset preferences
                      </UI.AlertDialogAction>
                    </UI.AlertDialogFooter>
                  </UI.AlertDialogContent>
                </UI.AlertDialog>
                {resetComplete && <span className="ml-2 text-xs text-muted-foreground">Reset complete</span>}
              </UI.SettingItemAction>
            </UI.SettingItem>
          </div>
        </UI.SettingsContent>
      </UI.Settings>
    </div>
  )
}
