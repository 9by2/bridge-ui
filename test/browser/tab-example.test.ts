import { expect, openPage, pollUntil, test } from "./support"

for (const variant of ["default", "line", "capsule"]) {
  test(`${variant} tab supports plain, badge and icon labels`, async () => {
    await using page = await openPage()
    await page.goto(`/?preview&theme=dark#tabs/${variant}`)
    const assets = page.getByRole("tab", { name: "Assets" })
    await pollUntil(() => assets.count())
    await expect(assets).toBeVisible()
    await expect(page.getByRole("tab", { name: "Colors 32" }).locator('[data-slot="badge"]')).toBeVisible()
    const icon = page.getByRole("tab", { name: "Todo 4" }).locator("svg")
    await expect(icon).toBeVisible()
    await expect(icon).toHaveCSS("width", "16px")
    await expect(icon).toHaveCSS("height", "16px")
  })
}
