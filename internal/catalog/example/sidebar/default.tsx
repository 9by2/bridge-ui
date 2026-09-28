import { BlocksIcon, BoxIcon, ChevronRightIcon, LayoutDashboardIcon } from "lucide-react"

import * as UI from "@bridge/ui"

// Example frame only: a bordered 880x380 viewport so the shell renders inside the catalog stage.
// Every Sidebar part below uses package defaults; a consumer writing the same JSX gets the same spacing.
export default function Example() {
  return (
    <div className="mx-auto w-full overflow-hidden border bg-background" style={{ height: 380, maxWidth: 880 }}>
      <UI.SidebarProvider defaultOpen style={{ minHeight: "100%" }}>
        <UI.Sidebar collapsible="none" role="navigation" aria-label="Workspace navigation">
          <UI.SidebarHeader>
            <UI.SidebarMenu>
              <UI.SidebarMenuItem>
                <UI.SidebarMenuButton size="lg">
                  <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                    <BlocksIcon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">Bridge workspace</span>
                    <span className="block truncate text-xs text-muted-foreground">Design system</span>
                  </span>
                </UI.SidebarMenuButton>
              </UI.SidebarMenuItem>
            </UI.SidebarMenu>
          </UI.SidebarHeader>
          <UI.SidebarSeparator />

          <UI.SidebarContent>
            <UI.SidebarGroup>
              <UI.SidebarGroupLabel>Workspace</UI.SidebarGroupLabel>
              <UI.SidebarGroupContent>
                <UI.SidebarMenu>
                  <UI.SidebarMenuItem>
                    <UI.SidebarMenuButton>
                      <LayoutDashboardIcon />
                      <span>Overview</span>
                    </UI.SidebarMenuButton>
                  </UI.SidebarMenuItem>
                  <UI.SidebarMenuItem>
                    <UI.SidebarMenuButton>
                      <BoxIcon />
                      <span className="flex-1">Component</span>
                      <ChevronRightIcon />
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

          <UI.SidebarSeparator />
          <UI.SidebarFooter>
            <UI.SidebarMenu>
              <UI.SidebarMenuItem>
                <UI.SidebarMenuButton size="lg">
                  <UI.Avatar size="sm">
                    <UI.AvatarFallback>NW</UI.AvatarFallback>
                  </UI.Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">Nara W.</span>
                    <span className="block truncate text-xs text-muted-foreground">Administrator</span>
                  </span>
                </UI.SidebarMenuButton>
              </UI.SidebarMenuItem>
            </UI.SidebarMenu>
          </UI.SidebarFooter>
        </UI.Sidebar>

        <UI.SidebarInset>
          <div className="flex min-h-0 flex-1 flex-col border-l">
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
              <p className="text-sm text-muted-foreground">
                Component <span className="px-1">/</span>{" "}
                <strong className="font-medium text-foreground">Navigation</strong>
              </p>
              <UI.Badge variant="outline">Published</UI.Badge>
            </header>
            <div className="grid flex-1 content-start gap-4 p-5">
              <div>
                <UI.Heading as={UI.WAIHeading.H3}>Navigation</UI.Heading>
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
          </div>
        </UI.SidebarInset>
      </UI.SidebarProvider>
    </div>
  )
}
