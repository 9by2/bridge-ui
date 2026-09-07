import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"]) {
  for (const width of [390, 1280]) {
    test(`owned presentation ${theme} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`/?preview&theme=${theme}&motion=reduced#drop-area/default`)
      await expect(page.locator('[data-slot="drop-area"]')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator(".example-stage")).toHaveScreenshot(`drop-area-${theme}-${width}.png`, {
        animations: "disabled"
      })
    })
  }
}
