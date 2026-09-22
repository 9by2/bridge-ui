import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Settings,
  SettingsContent,
  SettingsNavItem,
  SettingsSidebar,
  SettingsSidebarHeader
} from "../../app/component/brand/stylex/settings"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("settings exposes navigation and content landmarks", () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  render(
    <Settings>
      <SettingsSidebar title="General">
        <SettingsNavItem isActive>General</SettingsNavItem>
      </SettingsSidebar>
      <SettingsContent aria-label="General settings">Content</SettingsContent>
    </Settings>
  )
  expect(screen.getByRole("navigation", { name: "Settings" })).toBeTruthy()
  expect(
    within(screen.getByRole("navigation", { name: "Settings" }))
      .getByRole("button", { name: "General" })
      .getAttribute("aria-current")
  ).toBe("page")
  expect(screen.getByRole("main", { name: "General settings" })).toBeTruthy()
})

test("settings sidebar places caller identity content before navigation", () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  const { container } = render(
    <Settings>
      <SettingsSidebar title="General">
        <SettingsSidebarHeader>
          <img alt="Nara W." src="/avatar.png" />
          <span>Administrator</span>
        </SettingsSidebarHeader>
        <SettingsNavItem>General</SettingsNavItem>
      </SettingsSidebar>
      <SettingsContent>Content</SettingsContent>
    </Settings>
  )
  const sidebar = screen.getByRole("navigation", { name: "Settings" })
  expect(screen.getByAltText("Nara W.").closest("[data-slot=settings-sidebar-header]")).not.toBeNull()
  expect(
    Array.from(sidebar.children).indexOf(container.querySelector("[data-slot=settings-sidebar-header]") as HTMLElement)
  ).toBeLessThan(
    Array.from(sidebar.children).indexOf(container.querySelector("[data-slot=settings-nav]") as HTMLElement)
  )
})

test("settings picker reports selection and closes on a small layout", async () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  vi.stubGlobal("innerWidth", 390)
  const select = vi.fn()
  render(
    <Settings>
      <SettingsSidebar title="General">
        <SettingsSidebarHeader>
          <span>Workspace owner</span>
        </SettingsSidebarHeader>
        <SettingsNavItem>General</SettingsNavItem>
        <SettingsNavItem onClick={select}>Connections</SettingsNavItem>
      </SettingsSidebar>
      <SettingsContent>Content</SettingsContent>
    </Settings>
  )
  const trigger = await screen.findByRole("button", { name: "General" })
  fireEvent.click(trigger)
  const dialog = screen.getByRole("dialog", { name: "General" })
  expect(within(dialog).getByText("Workspace owner")).toBeTruthy()
  fireEvent.click(within(dialog).getByRole("button", { name: "Connections" }))
  expect(select).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole("dialog")).toBeNull()
})

test("settings picker remains open when a caller prevents section selection", async () => {
  vi.stubGlobal("matchMedia", () => ({ addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  vi.stubGlobal("innerWidth", 390)
  render(
    <Settings>
      <SettingsSidebar title="General">
        <SettingsNavItem onClick={(event) => event.preventDefault()}>Connections</SettingsNavItem>
      </SettingsSidebar>
      <SettingsContent>Content</SettingsContent>
    </Settings>
  )
  fireEvent.click(await screen.findByRole("button", { name: "General" }))
  const dialog = screen.getByRole("dialog", { name: "General" })
  fireEvent.click(within(dialog).getByRole("button", { name: "Connections" }))
  expect(screen.getByRole("dialog", { name: "General" })).toBeTruthy()
})
