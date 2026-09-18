import { expect, openPage, pollUntil, test } from "./support"

test("private descendant adapter leaves outside caller content unchanged", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview&theme=light#badge/default")
  const badge = page.locator('[data-slot="badge"]').first()
  await pollUntil(() => badge.count())
  await expect(badge).toBeVisible()
  const result = await page.evaluate<{ outside: string; inside: string }>(`() => {
    const outside = document.createElement("span")
    outside.dataset.slot = "badge"
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    icon.setAttribute("width", "24")
    icon.setAttribute("height", "24")
    outside.append(icon)
    document.body.append(outside)
    const inside = outside.cloneNode(true)
    document.querySelector("[data-pilot-theme]").append(inside)
    const measured = {
      outside: getComputedStyle(icon).width,
      inside: getComputedStyle(inside.querySelector("svg")).width
    }
    outside.remove()
    inside.remove()
    return measured
  }`)
  expect(result).toEqual({ outside: "24px", inside: "12px" })
})
