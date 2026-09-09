import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"])
  test(`candidate layout interaction ${theme}`, async ({ page }) => {
    await page.goto(`/style-x?preview&theme=${theme}#accordion/default`)
    const trigger = page.locator('[data-slot="accordion-trigger"]').first()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator('[data-slot="accordion-content"]').first()).toBeVisible()
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await page.goto(`/style-x?preview&theme=${theme}#tabs/default`)
    const tab = page.getByRole("tab").last()
    await tab.click()
    await expect(tab).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tabpanel", { name: "Two" })).toBeVisible()
    await expect(page.getByRole("tabpanel", { name: "One" })).toHaveCount(0)
    await page.goto(`/style-x?preview&theme=${theme}#table/default`)
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByRole("row").first()).toBeVisible()
    for (const name of ["tooltip", "hover-card"]) {
      await page.mouse.move(0, 0)
      await page.goto(`/style-x?preview&theme=${theme}#${name}/default`)
      await page.locator(`[data-slot=${name}-trigger]`).hover()
      await expect(page.locator(`[data-pilot-theme=${theme}] [data-slot=${name}-content]`)).toBeVisible()
      await page.mouse.move(0, 0)
      await expect(page.locator(`[data-slot=${name}-content]`)).toHaveCount(0)
      if (name === "tooltip") {
        await page.keyboard.press("Tab")
        await expect(page.locator('[data-slot="tooltip-trigger"]')).toBeFocused()
        await expect(page.locator('[data-slot="tooltip-content"]')).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.locator('[data-slot="tooltip-content"]')).toHaveCount(0)
      }
    }
  })
