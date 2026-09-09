import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "../../internal/pilot/context-menu"
import * as Context from "../../internal/pilot/context-menu"
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "../../internal/pilot/dropdown-menu"
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "../../internal/pilot/menubar"
import * as Bar from "../../internal/pilot/menubar"
import { Theme } from "../../internal/pilot/theme"

afterEach(cleanup)
test("menu popup ending state remains rendered until exit", () => {
  const portal = render(
    <DropdownMenu open>
      <DropdownMenuPortal>
        <span>Dropdown portal</span>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
  expect(screen.getByText("Dropdown portal")).toBeTruthy()
  portal.unmount()
  const contextPortal = render(
    <Context.ContextMenu open>
      <Context.ContextMenuPortal>
        <span>Context portal</span>
      </Context.ContextMenuPortal>
    </Context.ContextMenu>
  )
  expect(screen.getByText("Context portal")).toBeTruthy()
  contextPortal.unmount()
  const menubarPortal = render(
    <Bar.Menubar>
      <Bar.MenubarMenu open>
        <Bar.MenubarPortal>
          <span>Menubar portal</span>
        </Bar.MenubarPortal>
      </Bar.MenubarMenu>
    </Bar.Menubar>
  )
  expect(screen.getByText("Menubar portal")).toBeTruthy()
  menubarPortal.unmount()
  const context = render(
    <Context.ContextMenu open>
      <Context.ContextMenuContent>
        <Context.ContextMenuItem>Hidden</Context.ContextMenuItem>
      </Context.ContextMenuContent>
    </Context.ContextMenu>
  )
  context.rerender(
    <Context.ContextMenu open={false}>
      <Context.ContextMenuContent>
        <Context.ContextMenuItem>Hidden</Context.ContextMenuItem>
      </Context.ContextMenuContent>
    </Context.ContextMenu>
  )
  context.unmount()
  const bar = render(
    <Bar.Menubar>
      <Bar.MenubarMenu open>
        <Bar.MenubarContent>
          <Bar.MenubarSub open>
            <Bar.MenubarSubTrigger>Sub</Bar.MenubarSubTrigger>
            <Bar.MenubarSubContent>
              <Bar.MenubarItem>Hidden</Bar.MenubarItem>
            </Bar.MenubarSubContent>
          </Bar.MenubarSub>
        </Bar.MenubarContent>
      </Bar.MenubarMenu>
    </Bar.Menubar>
  )
  bar.rerender(
    <Bar.Menubar>
      <Bar.MenubarMenu open={false}>
        <Bar.MenubarContent>
          <Bar.MenubarSub open={false}>
            <Bar.MenubarSubTrigger>Sub</Bar.MenubarSubTrigger>
            <Bar.MenubarSubContent>
              <Bar.MenubarItem>Hidden</Bar.MenubarItem>
            </Bar.MenubarSubContent>
          </Bar.MenubarSub>
        </Bar.MenubarContent>
      </Bar.MenubarMenu>
    </Bar.Menubar>
  )
})
test("context menu full composition and callback style", async () => {
  for (const callback of [false, true]) {
    const className = callback ? () => "caller" : "caller"
    const { unmount } = render(
      <Context.ContextMenu open>
        <Context.ContextMenuTrigger className={className}>Target</Context.ContextMenuTrigger>
        <Context.ContextMenuContent className={className}>
          <Context.ContextMenuGroup>
            <Context.ContextMenuLabel inset={callback} className={className}>
              Label
            </Context.ContextMenuLabel>
            <Context.ContextMenuItem
              inset={callback}
              variant={callback ? "destructive" : "default"}
              className={className}>
              Item<Context.ContextMenuShortcut>R</Context.ContextMenuShortcut>
            </Context.ContextMenuItem>
          </Context.ContextMenuGroup>
          <Context.ContextMenuCheckboxItem checked inset={callback} className={className}>
            Checked
          </Context.ContextMenuCheckboxItem>
          <Context.ContextMenuRadioGroup value="a">
            <Context.ContextMenuRadioItem value="a" inset={callback} className={className}>
              A
            </Context.ContextMenuRadioItem>
          </Context.ContextMenuRadioGroup>
          <Context.ContextMenuSeparator className={className} />
          <Context.ContextMenuSub open>
            <Context.ContextMenuSubTrigger inset={callback} className={className}>
              Sub
            </Context.ContextMenuSubTrigger>
            <Context.ContextMenuSubContent className={className}>
              <Context.ContextMenuItem>Nested</Context.ContextMenuItem>
            </Context.ContextMenuSubContent>
          </Context.ContextMenuSub>
        </Context.ContextMenuContent>
      </Context.ContextMenu>
    )
    expect(await screen.findByText("Nested")).toBeTruthy()
    unmount()
  }
})
test("menubar full composition and callback style", async () => {
  for (const callback of [false, true]) {
    const className = callback ? () => "caller" : "caller"
    const { unmount } = render(
      <Bar.Menubar className={className}>
        <Bar.MenubarMenu open>
          <Bar.MenubarTrigger className={className}>File</Bar.MenubarTrigger>
          <Bar.MenubarContent className={className}>
            <Bar.MenubarGroup>
              <Bar.MenubarLabel inset={callback} className={className}>
                Label
              </Bar.MenubarLabel>
              <Bar.MenubarItem>
                Item<Bar.MenubarShortcut>R</Bar.MenubarShortcut>
              </Bar.MenubarItem>
            </Bar.MenubarGroup>
            <Bar.MenubarCheckboxItem checked className={className}>
              Checked
            </Bar.MenubarCheckboxItem>
            <Bar.MenubarRadioGroup value="a">
              <Bar.MenubarRadioItem value="a" className={className}>
                A
              </Bar.MenubarRadioItem>
            </Bar.MenubarRadioGroup>
            <Bar.MenubarSeparator />
            <Bar.MenubarSub open>
              <Bar.MenubarSubTrigger>Sub</Bar.MenubarSubTrigger>
              <Bar.MenubarSubContent className={className}>
                <Bar.MenubarItem>Nested</Bar.MenubarItem>
              </Bar.MenubarSubContent>
            </Bar.MenubarSub>
          </Bar.MenubarContent>
        </Bar.MenubarMenu>
      </Bar.Menubar>
    )
    expect(await screen.findByText("Nested")).toBeTruthy()
    unmount()
  }
})
test("menubar retains shared menu engine", async () => {
  render(
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
  fireEvent.click(screen.getByRole("menuitem", { name: "File" }))
  expect(await screen.findByRole("menuitem", { name: "New" })).toBeTruthy()
})
test("context menu opens on context gesture", async () => {
  render(
    <ContextMenu>
      <ContextMenuTrigger>Target</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Action</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
  fireEvent.contextMenu(screen.getByText("Target"), { clientX: 20, clientY: 20 })
  expect(await screen.findByRole("menuitem", { name: "Action" })).toBeTruthy()
})
test("menu inset destructive and callback style remain supported", async () => {
  render(
    <DropdownMenu open>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent className={() => "content"}>
        <DropdownMenuGroup>
          <DropdownMenuLabel inset className={() => "label"}>
            Label
          </DropdownMenuLabel>
          <DropdownMenuItem inset variant="destructive" className={() => "item"}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuCheckboxItem inset checked className={() => "check"}>
          Checked
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="a">
          <DropdownMenuRadioItem inset value="a" className={() => "radio"}>
            A
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className={() => "separator"} />
        <DropdownMenuSub open>
          <DropdownMenuSubTrigger inset className={() => "sub"}>
            Sub
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className={() => "subcontent"}>
            <DropdownMenuItem>Nested</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  expect((await screen.findByText("Delete")).className).toContain("item")
  expect(await screen.findByText("Nested")).toBeTruthy()
})
test("menu retains themed portal and item callback", async () => {
  const click = vi.fn()
  render(
    <Theme mode="dark">
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuItem onClick={click}>
              Run<DropdownMenuShortcut>R</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Theme>
  )
  fireEvent.click(screen.getByRole("button"))
  const item = await screen.findByRole("menuitem")
  expect(item.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("dark")
  fireEvent.click(item)
  expect(click).toHaveBeenCalledOnce()
})
test("menu preserves checkbox radio and nested composition", async () => {
  render(
    <DropdownMenu open>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="a">
          <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub open>
          <DropdownMenuSubTrigger>Sub</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Nested</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  expect((await screen.findByRole("menuitemcheckbox")).getAttribute("aria-checked")).toBe("true")
  expect(screen.getByRole("menuitemradio").getAttribute("aria-checked")).toBe("true")
  expect(await screen.findByText("Nested")).toBeTruthy()
})
