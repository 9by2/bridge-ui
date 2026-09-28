import { BlocksIcon, BoxIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.Sidebar collapsible="none" role="navigation" aria-label="Persistent navigation">
        <UI.SidebarHeader>
          <UI.SidebarMenu>
            <UI.SidebarMenuItem>
              <UI.SidebarMenuButton>
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
                  <UI.SidebarMenuButton isActive>
                    <LayoutDashboardIcon /> Overview
                  </UI.SidebarMenuButton>
                </UI.SidebarMenuItem>
                <UI.SidebarMenuItem>
                  <UI.SidebarMenuButton>
                    <BoxIcon /> Component
                  </UI.SidebarMenuButton>
                </UI.SidebarMenuItem>
              </UI.SidebarMenu>
            </UI.SidebarGroupContent>
          </UI.SidebarGroup>
        </UI.SidebarContent>
      </UI.Sidebar>
      <UI.SidebarInset>
        <header className="flex h-16 items-center border-b px-6">
          <div>
            <UI.Heading as={UI.WAIHeading.H3}>Persistent sidebar</UI.Heading>
            <p className="text-xs text-muted-foreground">This mode has no collapse control or released space.</p>
          </div>
        </header>
        <div className="p-6 text-sm text-muted-foreground">Use for navigation that must remain visible on desktop.</div>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
