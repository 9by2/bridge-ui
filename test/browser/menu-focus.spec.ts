import { expect, test } from "@playwright/test"

test("menu keyboard navigation never retains focus on a hidden guard", async ({ page }) => {
  await page.goto("/?preview#dropdown-menu/item-variant")
  const trigger = page.getByRole("button", { name: "Menu", exact: true })
  await trigger.focus()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("menuitem", { name: "Default", exact: true })).toBeFocused()
  await expect(page.getByRole("region", { name: "Menu action" })).toContainText("Destructive")
  const guard = page.locator('[data-base-ui-focus-guard][aria-hidden="true"]').first()
  await expect(guard).toHaveAttribute("tabindex", "0")
  expect(
    await guard.evaluate((element) => {
      const style = getComputedStyle(element)
      return { width: style.width, height: style.height, pointer: style.pointerEvents }
    })
  ).toEqual({ width: "0px", height: "0px", pointer: "none" })
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("menuitem", { name: "Destructive", exact: true })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("menu")).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Default", exact: true })).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(page.getByRole("menu")).toHaveCount(0)
  expect(await page.evaluate(() => document.activeElement?.hasAttribute("data-base-ui-focus-guard"))).toBe(false)
})
