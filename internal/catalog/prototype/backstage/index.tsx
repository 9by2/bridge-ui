import { ContentPage } from "@catalog-prototype/backstage/page/content"
import { DashboardPage } from "@catalog-prototype/backstage/page/dashboard"
import { EventPage } from "@catalog-prototype/backstage/page/event"
import { MessagePage } from "@catalog-prototype/backstage/page/message"
import { MusicianPage } from "@catalog-prototype/backstage/page/musician"
import { QueuePage } from "@catalog-prototype/backstage/page/queue"
import { ReleasePage } from "@catalog-prototype/backstage/page/release"
import { SettingPage } from "@catalog-prototype/backstage/page/setting"
import { TicketPage } from "@catalog-prototype/backstage/page/ticket"
import { ConsoleShell, type ConsoleNavigationGroup } from "@catalog-prototype/shared/console-shell"
import type { ValueOf } from "@catalog-prototype/shared/support"
import {
  CalendarDaysIcon,
  DiscIcon,
  ImageIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  MessageSquareIcon,
  MicVocalIcon,
  SettingsIcon,
  TicketIcon
} from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

export const BackstagePage = {
  DASHBOARD: "dashboard",
  EVENT: "event",
  QUEUE: "queue",
  MUSICIAN: "musician",
  RELEASE: "release",
  TICKET: "ticket",
  MESSAGE: "message",
  CONTENT: "content",
  SETTING: "setting"
} as const
export type BackstagePage = ValueOf<typeof BackstagePage>

const navigation: readonly ConsoleNavigationGroup<BackstagePage>[] = [
  {
    label: "Studio",
    item: [
      { page: BackstagePage.DASHBOARD, label: "Dashboard", icon: LayoutDashboardIcon },
      { page: BackstagePage.EVENT, label: "Event", icon: CalendarDaysIcon },
      { page: BackstagePage.QUEUE, label: "Backstage queue", icon: ListChecksIcon, badge: "23" }
    ]
  },
  {
    label: "Roster",
    item: [
      { page: BackstagePage.MUSICIAN, label: "Musician", icon: MicVocalIcon },
      { page: BackstagePage.RELEASE, label: "Release", icon: DiscIcon },
      { page: BackstagePage.TICKET, label: "Box office", icon: TicketIcon }
    ]
  },
  {
    label: "Workspace",
    item: [
      { page: BackstagePage.MESSAGE, label: "Message", icon: MessageSquareIcon, badge: "3" },
      { page: BackstagePage.CONTENT, label: "Web banner", icon: ImageIcon },
      { page: BackstagePage.SETTING, label: "Setting", icon: SettingsIcon }
    ]
  }
]
const pageComponent = {
  [BackstagePage.DASHBOARD]: DashboardPage,
  [BackstagePage.EVENT]: EventPage,
  [BackstagePage.QUEUE]: QueuePage,
  [BackstagePage.MUSICIAN]: MusicianPage,
  [BackstagePage.RELEASE]: ReleasePage,
  [BackstagePage.TICKET]: TicketPage,
  [BackstagePage.MESSAGE]: MessagePage,
  [BackstagePage.CONTENT]: ContentPage,
  [BackstagePage.SETTING]: SettingPage
} as const

const brandIcon = (
  <UI.Avatar size="sm">
    <UI.AvatarFallback>B</UI.AvatarFallback>
  </UI.Avatar>
)

export function BackstageConsole() {
  const [page, setPage] = useState<BackstagePage>(BackstagePage.DASHBOARD)
  const Page = pageComponent[page]
  return (
    <ConsoleShell
      brand={{ name: "Backstage", detail: "Bridge Studio", icon: brandIcon }}
      user={{ name: "Nara W.", email: "nara@bridge.studio", initial: "NW" }}
      workspace={["Bridge Studio", "Smallroom", "What The Duck"]}
      notification={[
        { id: "n1", title: "Payout ready", description: "September statement for 14 musician", initial: "฿" },
        { id: "n2", title: "Import failed", description: "Q-5099 Apple Music checksum mismatch", initial: "!" },
        { id: "n3", title: "New message", description: "Impact Arena: load-in moved to 13:00", initial: "IA" },
        { id: "n4", title: "Ticket milestone", description: "Polycat Live 95% sold", initial: "PC" }
      ]}
      navigation={navigation}
      page={page}
      onPageChange={setPage}>
      <Page />
    </ConsoleShell>
  )
}
