import { expect, openPage, pollUntil, test } from "./support"

test("menu keyboard navigation never retains focus on a hidden guard", async () => {
  await using page = await openPage()
  await page.goto("/?preview#dropdown-menu/item-variant")
  const trigger = page.getByRole("button", { name: "Menu", exact: true })
  await pollUntil(() => trigger.count())
  await trigger.focus()
  await page.pressKey("ArrowDown")
  await expect(page.getByRole("menuitem", { name: "Default", exact: true })).toBeFocused()
  await expect(page.getByRole("region", { name: "Menu action" })).toContainText("Destructive")
  const guard = page.locator("[data-base-ui-focus-guard][aria-hidden='true']").first()
  await expect(guard).toHaveAttribute("tabindex", "0")
  expect(
    await guard.evaluate<{ width: string; height: string; pointer: string }>(`(element) => {
      const style = getComputedStyle(element)
      return { width: style.width, height: style.height, pointer: style.pointerEvents }
    }`)
  ).toEqual({ width: "0px", height: "0px", pointer: "none" })
  await page.pressKey("ArrowDown")
  await expect(page.getByRole("menuitem", { name: "Destructive", exact: true })).toBeFocused()
  await page.pressKey("Escape")
  await expect(trigger).toBeFocused()
  await page.pressKey("ArrowDown")
  await expect(page.getByRole("menu")).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "Default", exact: true })).toBeFocused()
  await page.pressKey("Tab")
  await expect(page.getByRole("menu")).toHaveCount(0)
  expect(await page.evaluate<boolean>(`() => document.activeElement?.hasAttribute("data-base-ui-focus-guard")`)).toBe(
    false
  )
})
