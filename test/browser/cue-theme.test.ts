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

test("Cue theme default button mirrors Cue's primary control recipe", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=cue#button/variant")
  const button = page.getByRole("button", { name: "default" })
  await pollUntil(() => button.count())
  await expect(button).toHaveCSS("background-color", "rgb(255, 255, 255)")
  await expect(button).toHaveCSS("color", "oklch(0.1776 0 0)")
  await expect(button).toHaveCSS("border-radius", "10px")
  await expect(button).toHaveCSS("height", "32px")
  await expect(button).toHaveCSS("font-size", "14px")
  await expect(button).toHaveCSS("font-weight", "500")
  await expect(button).toHaveCSS("transition-property", "all")
  await expect(button).toHaveCSS("transition-timing-function", "cubic-bezier(0.4, 0, 0.2, 1)")
})

test("Cue theme preserves Cue button variant and expanded recipes", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=cue#button/variant")
  const outline = page.getByRole("button", { name: "outline" })
  const secondary = page.getByRole("button", { name: "secondary" })
  const cta = page.getByRole("button", { name: "cta" })
  await pollUntil(async () => {
    const outlineCount = await outline.count()
    const secondaryCount = await secondary.count()
    const ctaCount = await cta.count()
    return Boolean(outlineCount && secondaryCount && ctaCount)
  })

  await expect(outline).toHaveCSS("background-color", "lab(5.0601 0 0)")
  await expect(outline).toHaveCSS("border-color", "lab(100 0 0 / 0.36)")
  await outline.evaluate(`(node) => node.setAttribute("aria-expanded", "true")`)
  await expect(outline).toHaveCSS("background-color", "lab(15.204 0 -0.00000596046)")

  const secondaryBackground = await secondary.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)
  await secondary.evaluate(`(node) => node.setAttribute("aria-expanded", "true")`)
  expect(await secondary.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)).toBe(secondaryBackground)

  await expect(cta).toHaveCSS(
    "transition-property",
    "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to"
  )
})

test("Cue theme preserves Cue link and size recipes", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=cue#button/variant")
  const link = page.getByRole("button", { name: "link" })
  await pollUntil(() => link.count())
  await expect(link).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  await expect(link).toHaveCSS("text-underline-offset", "4px")

  await page.goto("/style-x?preview&theme=cue#button/size")
  const xs = page.getByRole("button", { name: "xs" })
  const sm = page.getByRole("button", { name: "sm" })
  const xl = page.getByRole("button", { name: "xl" })
  await pollUntil(async () => Boolean((await xs.count()) && (await sm.count()) && (await xl.count())))
  await expect(xs).toHaveCSS("height", "24px")
  await expect(xs).toHaveCSS("font-size", "12px")
  await expect(sm).toHaveCSS("height", "28px")
  await expect(sm).toHaveCSS("font-size", "12.8px")
  await expect(xl).toHaveCSS("height", "44px")
  await expect(xl).toHaveCSS("font-size", "18px")
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
