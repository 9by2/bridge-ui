import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"]) {
  test(`StyleX control interaction ${theme}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    for (const name of [
      "checkbox",
      "switch",
      "radio-group",
      "toggle",
      "slider",
      "progress",
      "native-select",
      "popover"
    ]) {
      await page.goto(`/style-x?preview&theme=${theme}#${name}/default`)
      await expect(page.locator("[data-pilot-theme]")).toHaveAttribute("data-pilot-theme", theme)
      if (name === "popover") {
        const trigger = page.locator('[data-slot="popover-trigger"]')
        await trigger.click()
        await expect(page.locator(`[data-pilot-theme=${theme}] [data-slot=popover-content]`)).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.locator('[data-slot="popover-content"]')).toHaveCount(0)
        await expect(trigger).toBeFocused()
      } else if (name === "checkbox" || name === "switch") {
        const control = page.getByRole(name).first()
        const before = await control.getAttribute("aria-checked")
        await control.click()
        await expect(control).toHaveAttribute("aria-checked", before === "true" ? "false" : "true")
      } else if (name === "slider") {
        await expect(page.locator('[data-slot="slider"]')).toHaveCSS("width", "320px")
        const control = page.getByRole("slider").first()
        await expect(control).toBeVisible()
        const before = Number(await control.getAttribute("aria-valuenow"))
        await control.focus()
        await page.keyboard.press("ArrowRight")
        await expect(control).toHaveAttribute("aria-valuenow", String(before + 1))
      } else if (name === "toggle") {
        const control = page.getByRole("button").first()
        await control.click()
        await expect(control).toHaveAttribute("aria-pressed", "true")
      } else if (name === "radio-group") {
        const control = page.getByRole("radio").last()
        await control.click()
        await expect(control).toHaveAttribute("aria-checked", "true")
      } else if (name === "native-select") {
        await expect(page.getByRole("combobox")).toBeVisible()
      } else await expect(page.getByRole("progressbar")).toBeVisible()
    }
    expect(errors).toEqual([])
  })
}
