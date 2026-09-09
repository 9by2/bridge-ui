import { expect, test } from "@playwright/test"

test("private descendant adapter leaves outside caller content unchanged", async ({ page }) => {
  await page.goto("/style-x?preview&theme=light#badge/default")
  await expect(page.locator('[data-slot="badge"]').first()).toBeVisible()
  const result = await page.evaluate(() => {
    const outside = document.createElement("span")
    outside.dataset.slot = "badge"
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    icon.setAttribute("width", "24")
    icon.setAttribute("height", "24")
    outside.append(icon)
    document.body.append(outside)
    const inside = outside.cloneNode(true) as HTMLElement
    document.querySelector("[data-pilot-theme]")!.append(inside)
    const measured = {
      outside: getComputedStyle(icon).width,
      inside: getComputedStyle(inside.querySelector("svg")!).width
    }
    outside.remove()
    inside.remove()
    return measured
  })
  expect(result).toEqual({ outside: "24px", inside: "12px" })
})
