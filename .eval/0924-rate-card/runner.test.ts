import { expect, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-rate-card"

test("rate card variants render, stay named and contained at desktop and mobile", async () => {
  await using page = await openPage()
  for (const [route, variants, count] of [
    ["row", "row", 3],
    ["card", "card", 3],
    ["plan", "plan", 3],
    ["states", undefined, 5],
    ["inline", "inline", 1]
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
          if (card.getAttribute("data-variants") === "inline") return card.closest('[role="combobox"], [role="option"]') !== null;
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
  await page.goto("/?preview&theme=dark#rate-card/inline")
  await pollUntil(() => page.locator('[role="combobox"]').count())
  await page.locator('[role="combobox"]').click()
  await pollUntil(() => page.locator('[role="option"]').count())
  expect(await page.locator('[role="option"]').count()).toBe(3)
  await Bun.write(`${out}/inline-dark-open.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.locator('[role="option"]').nth(1).click()
  await pollUntil(async () => ((await page.evaluate<string>(`() => document.querySelector('[role="combobox"]')?.textContent ?? ""`)).includes("Corporate") ? 1 : 0))
  await Bun.write(`${out}/inline-dark-selected.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.goto("/?preview&theme=light#rate-card/plan")
  await pollUntil(() => page.locator('[data-highlight="true"]').count())
  expect(await page.locator('[data-highlight="true"]').count()).toBe(1)
})
