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

test("every public component slot uses square corners", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.goto(`/?preview&theme=${theme}#button/default`)
    const failures = await page
      .locator("[data-pilot-theme] [data-slot], [data-pilot-theme] [data-slot] *")
      .evaluateAll((nodes) =>
        nodes.flatMap((node) => {
          const radius = getComputedStyle(node).borderRadius
          const before = getComputedStyle(node, "::before").borderRadius
          const after = getComputedStyle(node, "::after").borderRadius
          return radius === "0px" && before === "0px" && after === "0px"
            ? []
            : [{ slot: (node as HTMLElement).dataset.slot, radius, before, after }]
        })
      )
    expect(failures).toEqual([])

    await page.evaluate(() => {
      const host = document.createElement("div")
      host.dataset.slot = "host-app"
      host.style.borderRadius = "12px"
      document.body.append(host)
    })
    await expect(page.locator('[data-slot="host-app"]')).toHaveCSS("border-radius", "12px")

    await page.goto(`/?preview&theme=${theme}#dialog/default`)
    await page.getByRole("button", { name: "Open dialog", exact: true }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    expect(
      await page
        .locator("[data-pilot-theme] [data-slot], [data-pilot-theme] [data-slot] *")
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => getComputedStyle(node).borderRadius !== "0px")
            .map((node) => (node as HTMLElement).dataset.slot)
        )
    ).toEqual([])
  }
})
