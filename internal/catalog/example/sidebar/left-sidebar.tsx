import { BridgeIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.Sidebar
        side="left"
        variant="sidebar"
        collapsible="icon"
        role="navigation"
        aria-label="Left sidebar navigation">
        <UI.SidebarHeader>
          <UI.SidebarMenu>
            <UI.SidebarMenuItem>
              <UI.SidebarMenuButton tooltip="Bridge workspace">
                <BridgeIcon /> <span>Bridge workspace</span>
              </UI.SidebarMenuButton>
            </UI.SidebarMenuItem>
          </UI.SidebarMenu>
        </UI.SidebarHeader>
        <UI.SidebarContent>
          <UI.SidebarMenu>
            <UI.SidebarMenuItem>
              <UI.SidebarMenuButton isActive>
                <LayoutDashboardIcon /> Overview
              </UI.SidebarMenuButton>
            </UI.SidebarMenuItem>
          </UI.SidebarMenu>
        </UI.SidebarContent>
      </UI.Sidebar>
      <UI.SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-6">
          <UI.SidebarTrigger />
          <div>
            <UI.Heading as={UI.WAIHeading.H3} className="text-sm font-semibold">
              Left sidebar
            </UI.Heading>
            <p className="text-xs text-muted-foreground">Flush navigation on the left edge.</p>
          </div>
        </header>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
