import { BlocksIcon, BoxIcon, ChevronRightIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="mx-auto w-full overflow-hidden border bg-background" style={{ height: 380, maxWidth: 880 }}>
      <UI.SidebarProvider defaultOpen>
        <UI.Sidebar collapsible="none" role="navigation" aria-label="Workspace navigation">
          <UI.SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
                <BlocksIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Bridge workspace</p>
                <p className="truncate text-xs text-muted-foreground">Design system</p>
              </div>
            </div>
          </UI.SidebarHeader>

          <UI.SidebarContent>
            <UI.SidebarGroup>
              <UI.SidebarGroupLabel>Workspace</UI.SidebarGroupLabel>
              <UI.SidebarGroupContent>
                <UI.SidebarMenu>
                  <UI.SidebarMenuItem>
                    <UI.SidebarMenuButton>
                      <LayoutDashboardIcon />
                      Overview
                    </UI.SidebarMenuButton>
                  </UI.SidebarMenuItem>
                  <UI.SidebarMenuItem>
                    <UI.SidebarMenuButton>
                      <BoxIcon />
                      Component
                      <ChevronRightIcon className="ml-auto" />
                    </UI.SidebarMenuButton>
                    <UI.SidebarMenuSub>
                      <UI.SidebarMenuSubItem>
                        <UI.SidebarMenuSubButton>Form</UI.SidebarMenuSubButton>
                      </UI.SidebarMenuSubItem>
                      <UI.SidebarMenuSubItem>
                        <UI.SidebarMenuSubButton isActive>Navigation</UI.SidebarMenuSubButton>
                      </UI.SidebarMenuSubItem>
                      <UI.SidebarMenuSubItem>
                        <UI.SidebarMenuSubButton>Feedback</UI.SidebarMenuSubButton>
                      </UI.SidebarMenuSubItem>
                    </UI.SidebarMenuSub>
                  </UI.SidebarMenuItem>
                </UI.SidebarMenu>
              </UI.SidebarGroupContent>
            </UI.SidebarGroup>
          </UI.SidebarContent>

          <UI.SidebarFooter className="border-t p-3">
            <UI.SidebarMenu>
              <UI.SidebarMenuItem>
                <UI.SidebarMenuButton size="lg">
                  <UI.Avatar size="sm">
                    <UI.AvatarFallback className="text-sidebar-foreground">NW</UI.AvatarFallback>
                  </UI.Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">Nara W.</span>
                    <span className="block truncate text-xs text-muted-foreground">Administrator</span>
                  </span>
                </UI.SidebarMenuButton>
              </UI.SidebarMenuItem>
            </UI.SidebarMenu>
          </UI.SidebarFooter>
        </UI.Sidebar>

        <UI.SidebarInset className="min-w-0 border-l">
          <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
            <p className="text-sm text-muted-foreground">
              Component <span className="px-1">/</span>{" "}
              <strong className="font-medium text-foreground">Navigation</strong>
            </p>
            <UI.Badge variant="outline">Published</UI.Badge>
          </header>
          <div className="grid flex-1 content-start gap-4 p-5">
            <div>
              <h3 className="text-base font-semibold">Navigation</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Organize product destinations into clear groups.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <section className="border p-4">
                <p className="text-xs text-muted-foreground">Primitive</p>
                <p className="mt-1 text-sm font-medium">Sidebar menu</p>
              </section>
              <section className="border p-4">
                <p className="text-xs text-muted-foreground">Current route</p>
                <p className="mt-1 text-sm font-medium">Navigation</p>
              </section>
            </div>
          </div>
        </UI.SidebarInset>
      </UI.SidebarProvider>
    </div>
  )
}
