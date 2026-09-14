import { expect, test } from "@playwright/test"

for (const variant of ["default", "line", "capsule"]) {
  test(`${variant} tab supports plain, badge and icon labels`, async ({ page }) => {
    await page.goto(`/?preview&theme=dark#tabs/${variant}`)
    await expect(page.getByRole("tab", { name: "Assets" })).toBeVisible()
    await expect(page.getByRole("tab", { name: "Colors 32" }).locator('[data-slot="badge"]')).toBeVisible()
    const icon = page.getByRole("tab", { name: "Todo 4" }).locator("svg")
    await expect(icon).toBeVisible()
    await expect(icon).toHaveCSS("width", "16px")
    await expect(icon).toHaveCSS("height", "16px")
  })
}
