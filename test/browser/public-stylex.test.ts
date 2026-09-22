import { expect, openPage, pollUntil, test } from "./support"

test("regular catalog uses promoted public StyleX source", async () => {
  await using page = await openPage()
  await page.goto("/?preview#button/default")
  const pilotButton = page.locator(".pilot-button").first()
  await pollUntil(() => pilotButton.count())
  await expect(pilotButton).toBeVisible()
  await page.goto("/?preview#dialog/default")
  const trigger = page.getByRole("button", { name: "Open dialog", exact: true })
  await pollUntil(() => trigger.count())
  await trigger.click()
  await expect(page.locator('[data-pilot-theme] [role="dialog"]')).toBeVisible()
  await page.pressKey("Escape")
  await expect(trigger).toBeFocused()
})

test("Dialog footer retains the selected Theme surface padding", async () => {
  await using page = await openPage()
  const expectedPadding = {
    compact: "12px",
    default: "16px",
    comfortable: "24px"
  } as const
  for (const [density, padding] of Object.entries(expectedPadding)) {
    await page.goto("/?preview#dialog/density")
    const trigger = page.getByRole("button", { name: density, exact: true })
    await pollUntil(() => trigger.count())
    await trigger.click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toHaveCSS("padding", padding)
    await expect(dialog.locator("[data-slot=dialog-footer]")).toHaveCSS("padding", padding)
    await expect(dialog.locator("[data-slot=dialog-footer]")).toHaveCSS("margin-left", `-${padding}`)
    await page.pressKey("Escape")
    await expect(dialog).toHaveCount(0)
  }
})

test("Dialog uses its scoped semantic background variable", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"]) {
    await page.goto(`/?preview&theme=${theme}#dialog/default`)
    const trigger = page.getByRole("button", { name: "Open dialog", exact: true })
    await pollUntil(() => trigger.count())
    await trigger.click()
    const dialog = page.getByRole("dialog")
    expect(await dialog.evaluate<string>(`(node) => getComputedStyle(node).backgroundColor`)).not.toBe(
      "rgba(0, 0, 0, 0)"
    )
    await dialog.evaluate(
      `(node) => node.closest('[data-bridge-theme]')?.style.setProperty('--bridge-color-dialog', 'midnightblue')`
    )
    await expect(dialog).toHaveCSS("background-color", "rgb(25, 25, 112)")
    await page.pressKey("Escape")
  }
})
