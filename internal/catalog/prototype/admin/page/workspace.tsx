import { notify } from "@catalog-prototype/shared/console-shell"
import { SettingsLayout } from "@catalog-prototype/shared/settings-layout"
import type { ValueOf } from "@catalog-prototype/shared/support"
import { BuildingIcon, KeyRoundIcon, PaletteIcon, ShieldCheckIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

const Section = { ORGANIZATION: "organization", SECURITY: "security", BRAND: "brand", API: "api" } as const
type Section = ValueOf<typeof Section>
const section = [
  { value: Section.ORGANIZATION, label: "Organization", icon: BuildingIcon },
  { value: Section.SECURITY, label: "Security", icon: ShieldCheckIcon },
  { value: Section.BRAND, label: "Brand", icon: PaletteIcon },
  { value: Section.API, label: "API key", icon: KeyRoundIcon }
] as const

function Organization() {
  const [dirty, setDirty] = useState(false)
  return (
    <>
      {dirty ? (
        <UI.StickyAlert tone="neutral" offset="4rem">
          Unsaved change.{" "}
          <UI.Button size="sm" onClick={() => (setDirty(false), notify.success("Organization saved"))}>
            Save
          </UI.Button>
        </UI.StickyAlert>
      ) : null}
      <UI.SettingItem variant="inline">
        <UI.SettingItemTitle>Workspace URL</UI.SettingItemTitle>
        <UI.SettingItemAction>
          <UI.InputGroup>
            <UI.InputGroupAddon>
              <UI.InputGroupText>acme.io/</UI.InputGroupText>
            </UI.InputGroupAddon>
            <UI.InputGroupInput aria-label="Workspace slug" defaultValue="acme-cloud" onChange={() => setDirty(true)} />
          </UI.InputGroup>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.SettingItem>
        <UI.SettingItemTitle>Default language</UI.SettingItemTitle>
        <UI.SettingItemAction>
          <UI.NativeSelect aria-label="Default language" defaultValue="en" onChange={() => setDirty(true)}>
            <UI.NativeSelectOption value="en">English</UI.NativeSelectOption>
            <UI.NativeSelectOption value="th">ไทย</UI.NativeSelectOption>
            <UI.NativeSelectOption value="ar">العربية</UI.NativeSelectOption>
          </UI.NativeSelect>
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.Accordion>
        <UI.AccordionItem value="danger">
          <UI.AccordionTrigger>Danger zone</UI.AccordionTrigger>
          <UI.AccordionContent>
            <UI.Alert variant="destructive">
              <UI.AlertTitle>Transfer ownership</UI.AlertTitle>
              <UI.AlertDescription>The new owner gains billing and deletion right.</UI.AlertDescription>
              <UI.AlertAction>
                <UI.Button size="sm" variant="destructive">
                  Transfer
                </UI.Button>
              </UI.AlertAction>
            </UI.Alert>
          </UI.AccordionContent>
        </UI.AccordionItem>
      </UI.Accordion>
    </>
  )
}

function Security() {
  const [verified, setVerified] = useState(false)
  return (
    <>
      <UI.SettingItem>
        <UI.SettingItemTitle>Require two-factor</UI.SettingItemTitle>
        <UI.SettingItemDescription>Every member must enroll within 7 day.</UI.SettingItemDescription>
        <UI.SettingItemAction>
          <UI.Switch aria-label="Require two-factor" defaultChecked />
        </UI.SettingItemAction>
      </UI.SettingItem>
      <UI.Field>
        <UI.FieldLabel htmlFor="verify-code">Confirm with your authenticator code</UI.FieldLabel>
        <UI.InputOTP id="verify-code" maxLength={6} onComplete={() => setVerified(true)}>
          <UI.InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <UI.InputOTPSlot key={index} index={index} />
            ))}
          </UI.InputOTPGroup>
        </UI.InputOTP>
        {verified ? <UI.FieldDescription>Verified.</UI.FieldDescription> : null}
      </UI.Field>
      <UI.Collapsible>
        <UI.CollapsibleTrigger showChevron>Active session (3)</UI.CollapsibleTrigger>
        <UI.CollapsibleContent>
          <UI.List>
            <li>MacBook Pro · Bangkok · now</li>
            <li>iPhone · Bangkok · 2 hour ago</li>
            <li>Windows · Singapore · 3 day ago</li>
          </UI.List>
        </UI.CollapsibleContent>
      </UI.Collapsible>
    </>
  )
}

function Brand() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <UI.Field>
        <UI.Label id="brand-accent">Accent color</UI.Label>
        <UI.ColorPicker mode="fill" aria-labelledby="brand-accent" defaultValue="blue" />
      </UI.Field>
      <UI.Muted>Preview the same Button inside nested Theme and Direction boundary.</UI.Muted>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <UI.Theme>
          <UI.Button>Default</UI.Button>
        </UI.Theme>
        <UI.Theme density={UI.bridgeDensity.compact}>
          <UI.Button>Compact</UI.Button>
        </UI.Theme>
        <UI.DirectionProvider direction="rtl">
          <div dir="rtl">
            <UI.Button>متابعة</UI.Button>
          </div>
        </UI.DirectionProvider>
      </div>
    </div>
  )
}

function ApiKey() {
  const [loading, setLoading] = useState(true)
  return loading ? (
    <div className="grid grid-cols-1 gap-3">
      <UI.DataState variant="loading">
        <UI.DataStateMedia>
          <UI.Spinner aria-label="Loading key" />
        </UI.DataStateMedia>
        <UI.DataStateTitle>Loading API key</UI.DataStateTitle>
        <UI.DataStateAction>
          <UI.Button variant="outline" onClick={() => setLoading(false)}>
            Skip
          </UI.Button>
        </UI.DataStateAction>
      </UI.DataState>
      <UI.Skeleton />
    </div>
  ) : (
    <UI.Empty>
      <UI.EmptyHeader>
        <UI.EmptyMedia variant="icon">
          <KeyRoundIcon aria-hidden="true" />
        </UI.EmptyMedia>
        <UI.EmptyTitle>No API key</UI.EmptyTitle>
        <UI.EmptyDescription>Create a key to call the Acme API.</UI.EmptyDescription>
      </UI.EmptyHeader>
      <UI.EmptyContent>
        <UI.Button onClick={() => notify.success("Key created", "sk_live_••••4f2a")}>Create key</UI.Button>
      </UI.EmptyContent>
    </UI.Empty>
  )
}

export function WorkspacePage() {
  const [current, setCurrent] = useState<Section>(Section.ORGANIZATION)
  return (
    <SettingsLayout owner="Acme Cloud" initial="AC" section={section} current={current} onCurrentChange={setCurrent}>
      {current === Section.ORGANIZATION ? <Organization /> : null}
      {current === Section.SECURITY ? <Security /> : null}
      {current === Section.BRAND ? <Brand /> : null}
      {current === Section.API ? <ApiKey /> : null}
    </SettingsLayout>
  )
}
