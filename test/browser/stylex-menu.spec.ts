import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"]) {
  for (const family of ["dropdown-menu", "context-menu", "menubar"]) {
    test(`${family} keyboard and portal ${theme}`, async ({ page }) => {
      await page.goto(`/style-x?preview&theme=${theme}#${family}/default`)
      const trigger = page.locator(`[data-slot="${family}-trigger"]`).first()
      await trigger.click({ button: family === "context-menu" ? "right" : "left" })
      const menu = page.getByRole("menu").first()
      await expect(menu).toBeVisible()
      expect(await menu.evaluate((node) => node.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme"))).toBe(
        theme
      )
      await page.keyboard.press("ArrowDown")
      await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("role"))).toMatch(/^menuitem/)
      await page.keyboard.press("Escape")
      await expect(menu).toHaveCount(0)
      if (family !== "context-menu") await expect(trigger).toBeFocused()
    })
  }
}
