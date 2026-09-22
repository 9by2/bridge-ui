import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { SettingItem, SettingItemAction, SettingItemDescription, SettingItemTitle } from "../../app"

afterEach(cleanup)

test("inline setting item retains its supporting copy and caller-owned edit control", () => {
  const { container } = render(
    <SettingItem variant="inline">
      <SettingItemTitle>Display name</SettingItemTitle>
      <SettingItemDescription>Shown to workspace members.</SettingItemDescription>
      <SettingItemAction>
        <button type="button">Edit display name</button>
      </SettingItemAction>
    </SettingItem>
  )

  expect(container.querySelector('[data-slot="setting-item"]')?.getAttribute("data-variant")).toBe("inline")
  expect(screen.getByText("Shown to workspace members.")).toBeTruthy()
  expect(screen.getByRole("button", { name: "Edit display name" })).toBeTruthy()
})

test("setting item accepts a nullable variant as the default presentation", () => {
  const { container } = render(<SettingItem variant={null}>Default setting</SettingItem>)

  expect(container.querySelector('[data-slot="setting-item"]')?.getAttribute("data-variant")).toBeNull()
})
