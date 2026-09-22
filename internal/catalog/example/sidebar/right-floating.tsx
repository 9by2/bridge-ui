import { BridgeIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.SidebarInset>
        <header className="flex h-16 items-center justify-end gap-3 border-b px-6">
          <div className="text-right">
            <UI.Heading as={UI.WAIHeading.H3} className="text-sm font-semibold">
              Right floating
            </UI.Heading>
            <p className="text-xs text-muted-foreground">Separated navigation on the right edge.</p>
          </div>
          <UI.SidebarTrigger />
        </header>
        <div className="p-6 text-sm text-muted-foreground">
          The floating surface keeps its own inset from the viewport.
        </div>
      </UI.SidebarInset>
      <UI.Sidebar
        side="right"
        variant="floating"
        collapsible="icon"
        role="navigation"
        aria-label="Right floating navigation">
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
    </UI.SidebarProvider>
  )
}
