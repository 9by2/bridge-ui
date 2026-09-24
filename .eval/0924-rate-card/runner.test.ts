import { expect, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-rate-card"

test("rate card variants render, stay named and contained at desktop and mobile", async () => {
  await using page = await openPage()
  for (const [route, variants, count] of [
    ["row", "row", 3],
    ["card", "card", 3],
    ["plan", "plan", 3],
    ["states", undefined, 5]
  ] as const) {
    for (const theme of ["light", "dark"] as const) {
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto(`/?preview&theme=${theme}#rate-card/${route}`)
      await pollUntil(() => page.locator('[data-slot="rate-card"]').count())
      expect(await page.locator('[data-slot="rate-card"]').count()).toBe(count)
      if (variants) expect(await page.locator(`[data-variants="${variants}"]`).count()).toBe(count)
      expect(
        await page.evaluate<boolean>(`() => [...document.querySelectorAll('[data-slot="rate-card"]')].every((card) => {
          const id = card.getAttribute("aria-labelledby");
          return Boolean(card.getAttribute("aria-label") || (id && document.getElementById(id)?.textContent));
        })`)
      ).toBe(true)
      await Bun.write(`${out}/${route}-${theme}-desktop.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
      await page.setViewportSize({ width: 390, height: 844 })
      expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
      await Bun.write(`${out}/${route}-${theme}-mobile.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/?preview&theme=light#rate-card/plan")
  await pollUntil(() => page.locator('[data-highlight="true"]').count())
  expect(await page.locator('[data-highlight="true"]').count()).toBe(1)
})
