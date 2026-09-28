/**
 * Independent consumer implementation of catalog `sidebar/default` and `dropdown-menu/default`.
 * Built against the packed `dist/` output with a consumer CSS entry (Tailwind before @bridge/ui/style.css),
 * never importing catalog source. `?label=<text>` replaces the Overview label and the first menu item.
 */
import { BlocksIcon, BoxIcon, ChevronRightIcon, LayoutDashboardIcon } from "lucide-react"
import type { ReactNode } from "react"
import { createRoot } from "react-dom/client"

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Heading,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  Theme,
  WAIHeading
} from "@bridge/ui"

import "./style.css"

const param = new URLSearchParams(location.search)
const label = param.get("label") ?? "Overview"
const view = param.get("view") ?? "sidebar"
// `?square` applies bridge-web's Theme radius override (csr-root.container.tsx) to prove it still reaches every part.
const square = param.has("square")
  ? { radius: { control: "0", controlSmall: "0", surface: "0", overlay: "0" } }
  : undefined

function SidebarScreen() {
  return (
    <div className="mx-auto w-full overflow-hidden border bg-background" style={{ height: 380, maxWidth: 880 }}>
      <SidebarProvider defaultOpen style={{ minHeight: "100%" }}>
        <Sidebar collapsible="none" role="navigation" aria-label="Workspace navigation">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                    <BlocksIcon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">Bridge workspace</span>
                    <span className="block truncate text-xs text-muted-foreground">Design system</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LayoutDashboardIcon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BoxIcon />
                      <span className="flex-1">Component</span>
                      <ChevronRightIcon />
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Form</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>Navigation</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Feedback</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <Avatar size="sm">
                    <AvatarFallback>NW</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">Nara W.</span>
                    <span className="block truncate text-xs text-muted-foreground">Administrator</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex min-h-0 flex-1 flex-col border-l">
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
              <p className="text-sm text-muted-foreground">Component / Navigation</p>
              <Badge variant="outline">Published</Badge>
            </header>
            <div className="p-5">
              <Heading as={WAIHeading.H3}>Navigation</Heading>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

function MenuScreen() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{label === "Overview" ? "Edit" : label}</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem defaultChecked>Show detail</DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Email</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Same stage as the catalog preview (internal/catalog/shell.css .example-stage) so surrounding layout matches.
function Stage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: innerWidth <= 800 ? 20 : 32,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box"
      }}>
      {children}
    </div>
  )
}

const root = document.getElementById("root")
if (root)
  createRoot(root).render(
    <Theme mode="dark" theme={square} style={{ display: "contents" }}>
      <Stage>{view === "sidebar" ? <SidebarScreen /> : <MenuScreen />}</Stage>
    </Theme>
  )
