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

test("component slots use Cue's own recipe radius, not a forced global reset (DEC-006, DEC-008)", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"]) {
    // Rounded-by-default Cue recipe: Button default, Card, Input all carry a real radius.
    await page.goto(`/?preview&theme=${theme}#button/default`)
    const defaultButton = page.locator('[data-slot="button"]').first()
    await pollUntil(() => defaultButton.count())
    await expect(defaultButton).toBeVisible()
    expect(await defaultButton.evaluate<string>(`(node) => getComputedStyle(node).borderRadius`)).not.toBe("0px")

    await page.goto(`/?preview&theme=${theme}#card/default`)
    const card = page.locator('[data-slot="card"]').first()
    await pollUntil(() => card.count())
    await expect(card).toBeVisible()
    expect(await card.evaluate<string>(`(node) => getComputedStyle(node).borderRadius`)).not.toBe("0px")

    // A package consumer's own host content must never be forcibly squared by package CSS.
    await page.evaluate(`() => {
      const host = document.createElement("div")
      host.dataset.slot = "host-app"
      host.style.borderRadius = "12px"
      document.body.append(host)
    }`)
    await expect(page.locator('[data-slot="host-app"]')).toHaveCSS("border-radius", "12px")
    await page.evaluate(`() => document.querySelector('[data-slot="host-app"]')?.remove()`)

    // Explicit Cue exceptions remain square/pill via their own component declaration.
    await page.goto(`/?preview&theme=${theme}#button/variant`)
    const cta = page.getByRole("button", { name: "cta" })
    await pollUntil(() => cta.count())
    await expect(cta).toHaveCSS("border-radius", "0px")

    await page.goto(`/?preview&theme=${theme}#avatar/default`)
    const avatar = page.locator('[data-slot="avatar"]').first()
    await pollUntil(() => avatar.count())
    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveCSS("border-radius", "9999px")
  }
})
