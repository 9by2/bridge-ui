import { expect, test } from "@playwright/test"

test("StyleX route retains catalog inventory and candidate iframe", async ({ page }) => {
  await page.goto("/#button/default")
  const navigation = page.getByRole("navigation", { name: "Component", exact: true })
  const baseline = await navigation.locator("a").allTextContents()
  await page.getByRole("link", { name: "StyleX preview", exact: true }).click()
  await expect(page).toHaveURL(/\/style-x.*#button\/default/)
  await expect(page.getByRole("status")).toContainText("Private candidate")
  expect(await navigation.locator("a").allTextContents()).toEqual(baseline)
  const frame = page.locator("iframe").first()
  await expect(frame).toHaveAttribute("src", /^\/style-x\?preview/)
  await expect(frame.contentFrame().locator(".pilot-button").first()).toBeVisible()
  await page.locator("details.code-panel").first().locator("summary").click()
  await expect(page.locator("details.code-panel").first()).toContainText("@catalog-pilot")
  await page.goto("/style-x#badge/default")
  await expect(page.getByRole("status")).toContainText("Parity review remains open")
})

for (const theme of ["light", "dark"])
  for (const width of [390, 1280]) {
    test(`StyleX dialog theme and cleanup ${theme} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/style-x?preview&theme=${theme}#dialog/default`)
      const trigger = page.getByRole("button", { name: "Open dialog", exact: true })
      await expect(trigger).toHaveClass(/pilot-button/)
      await trigger.click()
      await expect(page.getByRole("dialog")).toBeVisible()
      await expect(page.locator(`[data-pilot-theme=${theme}] [role=dialog]`)).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("dialog")).toHaveCount(0)
      await expect(trigger).toBeFocused()
    })
  }
