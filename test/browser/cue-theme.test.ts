import { expect, openPage, pollUntil, test } from "./support"

test("Cue theme exposes exact semantic action and native style", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=cue#button/variant")
  const theme = page.locator('[data-pilot-theme="cue"]')
  await pollUntil(() => theme.count())
  await expect(theme).toBeVisible()
  await expect(theme).toHaveCSS("color-scheme", "dark")

  const cta = page.getByRole("button", { name: "cta" })
  await expect(cta).toHaveCSS("border-radius", "0px")
  await expect(cta).toHaveCSS("font-family", /Plus Jakarta Sans Variable/)
  expect(await cta.evaluate<string>(`(node) => getComputedStyle(node).backgroundImage`)).toContain("linear-gradient")

  const warning = page.getByRole("button", { name: "warning" })
  const destructive = page.getByRole("button", { name: "destructive" })
  expect(await warning.evaluate<string>(`(node) => getComputedStyle(node).color`)).toBe(
    await destructive.evaluate<string>(`(node) => getComputedStyle(node).color`)
  )
  expect(await warning.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)).not.toBe(
    "rgba(0, 0, 0, 0)"
  )
  expect(await destructive.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)).not.toBe(
    "rgba(0, 0, 0, 0)"
  )
})

test("Cue theme exposes status and native control semantic", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=cue#badge/variant")
  await pollUntil(() => page.getByText("success", { exact: true }).count())
  await expect(page.getByText("success", { exact: true })).toBeVisible()
  await expect(page.getByText("partial-success", { exact: true })).toBeVisible()
  await expect(page.getByText("warning", { exact: true })).toBeVisible()

  await page.goto("/style-x?preview&theme=cue#native-select/default")
  const select = page.getByRole("combobox")
  await pollUntil(() => select.count())
  await expect(select).toBeVisible()
  await expect(select).toHaveCSS("color-scheme", "dark")
})

test("Cue theme carries into dialog portal and heading font", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=cue#dialog/default")
  const opener = page.getByRole("button", { name: "Open dialog" })
  await pollUntil(() => opener.count())
  await opener.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.locator("[data-slot=dialog-title]")).toHaveCSS("font-family", /Plus Jakarta Sans Variable/)
  expect(
    await dialog.evaluate<string | null>(
      `(node) => node.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")`
    )
  ).toBe("cue")
})

test("Cue preset stays distinct from generic dark sidebar", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=dark#sidebar/default")
  const genericSidebar = page.locator('[data-slot="sidebar"]')
  await pollUntil(() => genericSidebar.count())
  const generic = await genericSidebar.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)

  await page.goto("/style-x?preview&theme=cue#sidebar/default")
  const sidebar = page.locator('[data-slot="sidebar"]')
  await pollUntil(() => sidebar.count())
  const cue = await sidebar.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)
  expect(cue).not.toBe(generic)
  await expect(page.locator('[data-slot="sidebar-menu-button"]').first()).toHaveCSS("color", /.+/)
})
