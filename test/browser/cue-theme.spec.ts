import { expect, test } from "@playwright/test"

test("Cue theme exposes exact semantic action and native style", async ({ page }) => {
  await page.goto("/style-x?preview&theme=cue#button/variant")
  const theme = page.locator('[data-pilot-theme="cue"]')
  await expect(theme).toBeVisible()
  await expect(theme).toHaveCSS("color-scheme", "dark")

  const cta = page.getByRole("button", { name: "cta" })
  await expect(cta).toHaveCSS("border-radius", "0px")
  await expect(cta).toHaveCSS("font-family", /Plus Jakarta Sans Variable/)
  expect(await cta.evaluate((node) => getComputedStyle(node).backgroundImage)).toContain("linear-gradient")

  const warning = page.getByRole("button", { name: "warning" })
  const destructive = page.getByRole("button", { name: "destructive" })
  expect(await warning.evaluate((node) => getComputedStyle(node).color)).toBe(
    await destructive.evaluate((node) => getComputedStyle(node).color)
  )
  expect(await warning.evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)")
  expect(await destructive.evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)")
})

test("Cue theme exposes status and native control semantic", async ({ page }) => {
  await page.goto("/style-x?preview&theme=cue#badge/variant")
  await expect(page.getByText("success", { exact: true })).toBeVisible()
  await expect(page.getByText("partial-success", { exact: true })).toBeVisible()
  await expect(page.getByText("warning", { exact: true })).toBeVisible()

  await page.goto("/style-x?preview&theme=cue#native-select/default")
  const select = page.getByRole("combobox")
  await expect(select).toBeVisible()
  await expect(select).toHaveCSS("color-scheme", "dark")
})

test("Cue theme carries into dialog portal and heading font", async ({ page }) => {
  await page.goto("/style-x?preview&theme=cue#dialog/default")
  await page.getByRole("button", { name: "Open dialog" }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.locator("[data-slot=dialog-title]")).toHaveCSS("font-family", /Plus Jakarta Sans Variable/)
  expect(await dialog.evaluate((node) => node.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme"))).toBe(
    "cue"
  )
})

test("Cue preset stays distinct from generic dark sidebar", async ({ page }) => {
  await page.goto("/style-x?preview&theme=dark#sidebar/default")
  const generic = await page.locator('[data-slot="sidebar"]').evaluate((node) => getComputedStyle(node).backgroundColor)

  await page.goto("/style-x?preview&theme=cue#sidebar/default")
  const sidebar = page.locator('[data-slot="sidebar"]')
  const cue = await sidebar.evaluate((node) => getComputedStyle(node).backgroundColor)
  expect(cue).not.toBe(generic)
  await expect(page.locator('[data-slot="sidebar-menu-button"]').first()).toHaveCSS("color", /.+/)
})
