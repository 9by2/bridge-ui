import { BillingPage } from "@catalog-prototype/admin/page/billing"
import { ConferencePage } from "@catalog-prototype/admin/page/conference"
import { FilePage } from "@catalog-prototype/admin/page/file"
import { HelpPage } from "@catalog-prototype/admin/page/help"
import { InboxPage } from "@catalog-prototype/admin/page/inbox"
import { OverviewPage } from "@catalog-prototype/admin/page/overview"
import { ProjectPage } from "@catalog-prototype/admin/page/project"
import { SchedulePage } from "@catalog-prototype/admin/page/schedule"
import { UserPage } from "@catalog-prototype/admin/page/user"
import { WorkspacePage } from "@catalog-prototype/admin/page/workspace"
import { ConsoleShell, type ConsoleNavigationGroup } from "@catalog-prototype/shared/console-shell"
import type { ValueOf } from "@catalog-prototype/shared/support"
import {
  BuildingIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  FolderKanbanIcon,
  FolderOpenIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PresentationIcon,
  UsersIcon
} from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

export const AdminPage = {
  OVERVIEW: "overview",
  USER: "user",
  PROJECT: "project",
  BILLING: "billing",
  FILE: "file",
  INBOX: "inbox",
  SCHEDULE: "schedule",
  CONFERENCE: "conference",
  WORKSPACE: "workspace",
  HELP: "help"
} as const
export type AdminPage = ValueOf<typeof AdminPage>

const navigation: readonly ConsoleNavigationGroup<AdminPage>[] = [
  {
    label: "General",
    item: [
      { page: AdminPage.OVERVIEW, label: "Overview", icon: LayoutDashboardIcon },
      { page: AdminPage.USER, label: "User", icon: UsersIcon },
      { page: AdminPage.PROJECT, label: "Project", icon: FolderKanbanIcon },
      { page: AdminPage.BILLING, label: "Billing", icon: CreditCardIcon }
    ]
  },
  {
    label: "Collaboration",
    item: [
      { page: AdminPage.FILE, label: "File", icon: FolderOpenIcon },
      { page: AdminPage.INBOX, label: "Inbox", icon: InboxIcon, badge: "2" },
      { page: AdminPage.SCHEDULE, label: "Calendar", icon: CalendarDaysIcon },
      { page: AdminPage.CONFERENCE, label: "Conference", icon: PresentationIcon }
    ]
  },
  {
    label: "Admin",
    item: [
      { page: AdminPage.WORKSPACE, label: "Workspace", icon: BuildingIcon },
      { page: AdminPage.HELP, label: "Help", icon: LifeBuoyIcon }
    ]
  }
]
const pageComponent = {
  [AdminPage.OVERVIEW]: OverviewPage,
  [AdminPage.USER]: UserPage,
  [AdminPage.PROJECT]: ProjectPage,
  [AdminPage.BILLING]: BillingPage,
  [AdminPage.FILE]: FilePage,
  [AdminPage.INBOX]: InboxPage,
  [AdminPage.SCHEDULE]: SchedulePage,
  [AdminPage.CONFERENCE]: ConferencePage,
  [AdminPage.WORKSPACE]: WorkspacePage,
  [AdminPage.HELP]: HelpPage
} as const

const brandIcon = (
  <UI.Avatar size="sm">
    <UI.AvatarFallback>A</UI.AvatarFallback>
  </UI.Avatar>
)

export function AdminConsole() {
  const [page, setPage] = useState<AdminPage>(AdminPage.OVERVIEW)
  const Page = pageComponent[page]
  return (
    <ConsoleShell
      brand={{ name: "Acme Admin", detail: "Acme Cloud", icon: brandIcon }}
      user={{ name: "Alex Kim", email: "alex@acme.io", initial: "AK" }}
      workspace={["Acme Cloud", "Acme Staging"]}
      notification={[
        { id: "n1", title: "Invoice paid", description: "INV-2026-009 · $1,975.00", initial: "$" },
        { id: "n2", title: "New ticket", description: "Globex: SSO login loop", initial: "GX" },
        { id: "n3", title: "Seat limit", description: "24 of 25 seat used", initial: "!" }
      ]}
      navigation={navigation}
      page={page}
      onPageChange={setPage}>
      <Page />
    </ConsoleShell>
  )
}
