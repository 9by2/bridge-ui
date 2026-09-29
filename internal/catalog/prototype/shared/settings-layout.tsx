import type { ComponentType, ReactNode } from "react"

import * as UI from "@bridge/ui"

export type SettingsSection<Value extends string> = { value: Value; label: string; icon: ComponentType }

/** Shared settings frame: owner header, section navigation and the active section content. */
export function SettingsLayout<Value extends string>({
  owner,
  initial,
  section,
  current,
  onCurrentChange,
  children
}: {
  owner: string
  initial: string
  section: readonly SettingsSection<Value>[]
  current: Value
  onCurrentChange: (value: Value) => void
  children: ReactNode
}) {
  const active = section.find((item) => item.value === current) ?? section[0]
  const label = active?.label ?? owner
  return (
    <UI.Settings>
      <UI.SettingsSidebar title={label}>
        <UI.SettingsSidebarHeader>
          <UI.Avatar size="sm">
            <UI.AvatarFallback>{initial}</UI.AvatarFallback>
          </UI.Avatar>
          <UI.TypographyLabel>{owner}</UI.TypographyLabel>
        </UI.SettingsSidebarHeader>
        {section.map((item) => {
          const Icon = item.icon
          return (
            <UI.SettingsNavItem
              key={item.value}
              isActive={item.value === current}
              onClick={() => onCurrentChange(item.value)}>
              <Icon aria-hidden="true" />
              {item.label}
            </UI.SettingsNavItem>
          )
        })}
      </UI.SettingsSidebar>
      <UI.SettingsContent aria-label={`${label} setting`}>
        <UI.Heading as={UI.WAIHeading.H2}>{label}</UI.Heading>
        {children}
      </UI.SettingsContent>
    </UI.Settings>
  )
}
