import { expect, test } from "@playwright/test"

test("regular catalog uses promoted public StyleX source", async ({ page }) => {
  await page.goto("/?preview#button/default")
  await expect(page.locator(".pilot-button").first()).toBeVisible()
  await page.goto("/?preview#dialog/default")
  const trigger = page.getByRole("button", { name: "Open dialog", exact: true })
  await trigger.click()
  await expect(page.locator('[data-pilot-theme] [role="dialog"]')).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("component slots use Cue's own recipe radius, not a forced global reset (DEC-006, DEC-008)", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    // Rounded-by-default Cue recipe: Button default, Card, Input all carry a real radius.
    await page.goto(`/?preview&theme=${theme}#button/default`)
    const defaultButton = page.locator('[data-slot="button"]').first()
    await expect(defaultButton).toBeVisible()
    expect(await defaultButton.evaluate((node) => getComputedStyle(node).borderRadius)).not.toBe("0px")

    await page.goto(`/?preview&theme=${theme}#card/default`)
    const card = page.locator('[data-slot="card"]').first()
    await expect(card).toBeVisible()
    expect(await card.evaluate((node) => getComputedStyle(node).borderRadius)).not.toBe("0px")

    // A package consumer's own host content must never be forcibly squared by package CSS.
    await page.evaluate(() => {
      const host = document.createElement("div")
      host.dataset.slot = "host-app"
      host.style.borderRadius = "12px"
      document.body.append(host)
    })
    await expect(page.locator('[data-slot="host-app"]')).toHaveCSS("border-radius", "12px")
    await page.evaluate(() => document.querySelector('[data-slot="host-app"]')?.remove())

    // Explicit Cue exceptions remain square/pill via their own component declaration.
    await page.goto(`/?preview&theme=${theme}#button/variant`)
    const cta = page.getByRole("button", { name: "cta" })
    await expect(cta).toHaveCSS("border-radius", "0px")

    await page.goto(`/?preview&theme=${theme}#avatar/default`)
    const avatar = page.locator('[data-slot="avatar"]').first()
    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveCSS("border-radius", "9999px")
  }
})
