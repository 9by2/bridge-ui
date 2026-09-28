import { BlocksIcon, BoxIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <UI.Sidebar collapsible="offcanvas" role="navigation" aria-label="Offcanvas navigation">
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
        <header className="flex h-16 items-center gap-3 border-b px-6">
          <UI.SidebarTrigger />
          <div>
            <UI.Heading as={UI.WAIHeading.H3}>Offcanvas collapse</UI.Heading>
            <p className="text-xs text-muted-foreground">Toggle to move the sidebar outside the viewport.</p>
          </div>
        </header>
        <div className="p-6 text-sm text-muted-foreground">The content expands into the released sidebar space.</div>
      </UI.SidebarInset>
    </UI.SidebarProvider>
  )
}
