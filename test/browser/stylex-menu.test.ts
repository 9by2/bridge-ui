import { expect, openPage, pollUntil, pollValue, test } from "./support"

for (const theme of ["light", "dark"]) {
  for (const family of ["dropdown-menu", "context-menu", "menubar"]) {
    test(`${family} keyboard and portal ${theme}`, async () => {
      await using page = await openPage()
      await page.goto(`/style-x?preview&theme=${theme}#${family}/default`)
      const trigger = page.locator(`[data-slot="${family}-trigger"]`).first()
      await pollUntil(() => trigger.count())
      await trigger.click({ button: family === "context-menu" ? "right" : "left" })
      const menu = page.getByRole("menu").first()
      await expect(menu).toBeVisible()
      expect(
        await menu.evaluate<string | null>(
          `(node) => node.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")`
        )
      ).toBe(theme)
      await page.pressKey("ArrowDown")
      await pollValue(
        () => page.evaluate<string | null>(`() => document.activeElement?.getAttribute("role")`),
        (value) => /^menuitem/.test(value ?? "")
      )
      await page.pressKey("Escape")
      await expect(menu).toHaveCount(0)
      if (family !== "context-menu") await expect(trigger).toBeFocused()
    })
  }
}
