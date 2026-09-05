import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.SidebarProvider defaultOpen>
      <div className="h-56 w-full overflow-hidden rounded border">
        <UI.Sidebar collapsible="none">
          <UI.SidebarHeader>Bridge UI</UI.SidebarHeader>
          <UI.SidebarContent>
            <UI.SidebarGroup>
              <UI.SidebarGroupLabel>Library</UI.SidebarGroupLabel>
              <UI.SidebarGroupContent>
                <UI.SidebarMenu>
                  <UI.SidebarMenuItem>
                    <UI.SidebarMenuButton isActive>Components</UI.SidebarMenuButton>
                  </UI.SidebarMenuItem>
                </UI.SidebarMenu>
              </UI.SidebarGroupContent>
            </UI.SidebarGroup>
          </UI.SidebarContent>
        </UI.Sidebar>
      </div>
    </UI.SidebarProvider>
  )
}
