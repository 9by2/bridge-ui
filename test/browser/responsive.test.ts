import { expect, openPage, pollUntil, test } from "./support"

test("responsive shell and owned composites remain contained on mobile", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of [
    "shell-header/default",
    "bridge-calendar/month",
    "image-crop/default",
    "metric-tile/variants",
    "rate-card/row",
    "rate-card/plan",
    "page/width",
    "page/header-slot"
  ]) {
    await page.goto(`/?preview&theme=light#${route}`)
    const stage = page.locator(".example-stage")
    await pollUntil(() => stage.count())
    await expect(stage).toBeVisible()
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  }
})

// Regression (0924): the `content` width style collided with the PageContent style key and silently
// dropped max-width. Protects the documented PageWidth max-width contract.
test("page width presets apply their documented max-width", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1600, height: 1000 })
  await page.goto("/?preview&theme=light#page/width")
  await pollUntil(() => page.locator('[data-slot="page"][data-width]').count())
  expect(
    await page.evaluate<Record<string, string>>(
      `() => Object.fromEntries([...document.querySelectorAll('[data-slot="page"][data-width]')].map((node) => [node.getAttribute("data-width"), getComputedStyle(node).maxWidth]))`
    )
  ).toEqual({ full: "none", content: "1280px", form: "768px", editor: "none" })
})
