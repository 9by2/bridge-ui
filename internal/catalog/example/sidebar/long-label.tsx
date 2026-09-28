import { FileTextIcon, LayoutDashboardIcon, ListIcon, NotebookTextIcon, UsersIcon } from "lucide-react"

import * as UI from "@bridge/ui"

const label = [
  { icon: LayoutDashboardIcon, text: "Home" },
  { icon: UsersIcon, text: "Team member invitations" },
  { icon: ListIcon, text: "Quarterly performance review for regional partner onboarding" },
  { icon: NotebookTextIcon, text: "TL;DR — release blockers, owners, and due dates" },
  {
    icon: FileTextIcon,
    text: "This destination label is a full paragraph so the example shows how the package truncates navigation copy that is far longer than the sidebar can display on a single row without wrapping or overflowing."
  }
] as const

// Example frame only: a bordered 880x380 viewport. Sidebar parts use package defaults, so a consumer
// rendering the same labels sees the same single-line truncation.
export default function Example() {
  return (
    <div className="mx-auto w-full overflow-hidden border bg-background" style={{ height: 380, maxWidth: 880 }}>
      <UI.SidebarProvider defaultOpen style={{ minHeight: "100%" }}>
        <UI.Sidebar collapsible="none" role="navigation" aria-label="Long label navigation">
          <UI.SidebarContent>
            <UI.SidebarGroup>
              <UI.SidebarGroupLabel>Workspace destinations with a deliberately long group label</UI.SidebarGroupLabel>
              <UI.SidebarGroupContent>
                <UI.SidebarMenu>
                  {label.map(({ icon: Icon, text }, index) => (
                    <UI.SidebarMenuItem key={text}>
                      <UI.SidebarMenuButton isActive={index === 2} title={text}>
                        <Icon />
                        <span>{text}</span>
                      </UI.SidebarMenuButton>
                      {index === 2 && (
                        <UI.SidebarMenuSub>
                          <UI.SidebarMenuSubItem>
                            <UI.SidebarMenuSubButton title={text}>
                              <span>{text}</span>
                            </UI.SidebarMenuSubButton>
                          </UI.SidebarMenuSubItem>
                        </UI.SidebarMenuSub>
                      )}
                    </UI.SidebarMenuItem>
                  ))}
                </UI.SidebarMenu>
              </UI.SidebarGroupContent>
            </UI.SidebarGroup>
          </UI.SidebarContent>
        </UI.Sidebar>
        <UI.SidebarInset>
          <div className="flex-1 border-l p-5 text-sm text-muted-foreground">
            Long labels stay on one row and truncate inside the sidebar.
          </div>
        </UI.SidebarInset>
      </UI.SidebarProvider>
    </div>
  )
}
