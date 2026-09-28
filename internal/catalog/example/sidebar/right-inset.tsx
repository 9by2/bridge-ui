import { BridgeIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.SidebarInset>
        <header className="flex h-16 items-center justify-end gap-3 border-b px-6">
          <div className="text-right">
            <UI.Heading as={UI.WAIHeading.H3}>Right inset</UI.Heading>
            <p className="text-xs text-muted-foreground">Inset content beside right navigation.</p>
          </div>
          <UI.SidebarTrigger />
        </header>
        <div className="p-6 text-sm text-muted-foreground">The content surface and sidebar retain separate edges.</div>
      </UI.SidebarInset>
      <UI.Sidebar side="right" variant="inset" collapsible="icon" role="navigation" aria-label="Right inset navigation">
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
