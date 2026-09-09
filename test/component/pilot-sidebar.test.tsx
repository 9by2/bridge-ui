import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "../../internal/pilot/sidebar"
import * as UI from "../../internal/pilot/sidebar"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
test("sidebar structural slot and collapsed variant matrix", () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  for (const side of ["left", "right"] as const)
    for (const variant of ["sidebar", "floating", "inset"] as const)
      for (const collapsible of ["none", "offcanvas", "icon"] as const) {
        const { unmount } = render(
          <UI.SidebarProvider defaultOpen={false}>
            <UI.Sidebar side={side} variant={variant} collapsible={collapsible}>
              <UI.SidebarInput aria-label="Search" />
              <UI.SidebarSeparator className={() => "separator"} />
              <UI.SidebarGroup>
                <UI.SidebarGroupLabel>Group</UI.SidebarGroupLabel>
                <UI.SidebarGroupAction>Action</UI.SidebarGroupAction>
                <UI.SidebarGroupContent>
                  <UI.SidebarMenu>
                    <UI.SidebarMenuItem>
                      <UI.SidebarMenuButton variant="outline" size="sm" tooltip="Tip">
                        Item
                      </UI.SidebarMenuButton>
                      <UI.SidebarMenuAction showOnHover>Action</UI.SidebarMenuAction>
                      <UI.SidebarMenuBadge>1</UI.SidebarMenuBadge>
                      <UI.SidebarMenuSub>
                        <UI.SidebarMenuSubItem>
                          <UI.SidebarMenuSubButton href="#child" size="sm">
                            Child
                          </UI.SidebarMenuSubButton>
                        </UI.SidebarMenuSubItem>
                      </UI.SidebarMenuSub>
                    </UI.SidebarMenuItem>
                  </UI.SidebarMenu>
                  <UI.SidebarMenuSkeleton showIcon />
                  <UI.SidebarMenuSkeleton />
                </UI.SidebarGroupContent>
              </UI.SidebarGroup>
              <UI.SidebarRail />
            </UI.Sidebar>
            <UI.SidebarInset>Content</UI.SidebarInset>
          </UI.SidebarProvider>
        )
        expect(screen.getByRole("link", { name: "Child" })).toBeTruthy()
        fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
        unmount()
      }
})
test("sidebar mobile toggle and direct setter", () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  vi.stubGlobal("innerWidth", 390)
  function Setter() {
    const { setOpen } = useSidebar()
    return <button onClick={() => setOpen(false)}>Set</button>
  }
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={{ children: "Tip" }}>
              Item
            </SidebarMenuButton>
            <UI.SidebarMenuSubButton>Child</UI.SidebarMenuSubButton>
            <UI.SidebarMenuAction>Action</UI.SidebarMenuAction>
          </SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
      <SidebarTrigger />
      <Setter />
    </SidebarProvider>
  )
  fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
  expect(screen.getByRole("dialog")).toBeTruthy()
  fireEvent.keyDown(window, { key: "b", metaKey: true })
  fireEvent.click(screen.getByRole("button", { name: "Set" }))
  fireEvent.keyDown(window, { key: "x" })
  fireEvent.keyDown(window, { key: "b" })
})
test("sidebar shortcut preserves cookie callback and disposes listener", () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  const change = vi.fn()
  const { unmount } = render(
    <SidebarProvider open onOpenChange={change}>
      <SidebarTrigger />
    </SidebarProvider>
  )
  fireEvent.keyDown(window, { key: "b", ctrlKey: true })
  expect(change).toHaveBeenCalledWith(false)
  expect(document.cookie).toContain("sidebar_state=false")
  fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" }))
  expect(change).toHaveBeenCalledTimes(2)
  unmount()
  fireEvent.keyDown(window, { key: "b", ctrlKey: true })
  expect(change).toHaveBeenCalledTimes(2)
})

test("sidebar retains provider diagnostic and server composition", () => {
  expect(
    renderToString(
      <SidebarProvider>
        <UI.SidebarSeparator />
      </SidebarProvider>
    )
  ).toContain("sidebar-separator")
  function Missing() {
    useSidebar()
    return null
  }
  expect(() => renderToString(<Missing />)).toThrow("useSidebar must be used within a SidebarProvider.")
  const html = renderToString(
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Item</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  )
  expect(html).toContain('data-state="expanded"')
  expect(html).toContain("Toggle Sidebar")
})
