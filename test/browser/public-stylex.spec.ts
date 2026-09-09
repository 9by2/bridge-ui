import { expect, test } from "@playwright/test"

test("regular catalog uses promoted public StyleX source", async ({ page }) => {
  await page.goto("/?preview#button/default")
  await expect(page.locator(".pilot-button").first()).toBeVisible()
  await page.goto("/?preview#dialog/default")
  const trigger = page.getByRole("button", { name: "Open dialog", exact: true })
  await trigger.click()
  await expect(page.locator('[data-pilot-theme] [role="dialog"]')).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})
