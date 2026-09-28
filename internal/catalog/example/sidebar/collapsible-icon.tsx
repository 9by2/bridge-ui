import { BlocksIcon, BoxIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.Sidebar collapsible="icon" role="navigation" aria-label="Icon navigation">
        <UI.SidebarHeader>
          <UI.SidebarMenu>
            <UI.SidebarMenuItem>
              <UI.SidebarMenuButton tooltip="Bridge workspace">
                <BlocksIcon /> <span className="font-semibold">Bridge workspace</span>
              </UI.SidebarMenuButton>
            </UI.SidebarMenuItem>
          </UI.SidebarMenu>
        </UI.SidebarHeader>
        <UI.SidebarContent>
          <UI.SidebarGroup>
            <UI.SidebarGroupLabel>Workspace</UI.SidebarGroupLabel>
            <UI.SidebarGroupContent>
              <UI.SidebarMenu>
                <UI.SidebarMenuItem>
                  <UI.SidebarMenuButton isActive tooltip="Overview">
                    <LayoutDashboardIcon /> <span>Overview</span>
                  </UI.SidebarMenuButton>
                </UI.SidebarMenuItem>
                <UI.SidebarMenuItem>
                  <UI.SidebarMenuButton tooltip="Component">
                    <BoxIcon /> <span>Component</span>
                  </UI.SidebarMenuButton>
                </UI.SidebarMenuItem>
              </UI.SidebarMenu>
            </UI.SidebarGroupContent>
          </UI.SidebarGroup>
        </UI.SidebarContent>
      </UI.Sidebar>
      <UI.SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-6">
          <UI.SidebarTrigger />
          <div>
            <UI.Heading as={UI.WAIHeading.H3}>Icon collapse</UI.Heading>
            <p className="text-xs text-muted-foreground">Toggle to retain a compact icon rail.</p>
          </div>
        </header>
        <div className="p-6 text-sm text-muted-foreground">Hover a collapsed icon to inspect its tooltip.</div>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
