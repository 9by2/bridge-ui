import { expect, openPage, pollUntil, test } from "./support"

test("Theme spacing and radius overrides reach owned recipes outside the P0 matrix", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#select/default")
  await pollUntil(() => page.locator('.example-stage [data-slot="select-trigger"]').count())

  const trigger = page.locator('.example-stage [data-slot="select-trigger"]')
  await page.evaluate(`() => {
    const theme = document.querySelector('[data-bridge-theme]');
    theme.style.setProperty('--bridge-control-radius', '3px');
    theme.style.setProperty('--bridge-space-2', '14px');
  }`)

  expect(await trigger.evaluate<string>(`(element) => getComputedStyle(element).borderRadius`)).toBe("3px")
  expect(await trigger.evaluate<string>(`(element) => getComputedStyle(element).gap`)).toBe("10.5px")
  expect(await trigger.evaluate<string>(`(element) => getComputedStyle(element).paddingLeft`)).toBe("17.5px")
  await Bun.write(
    ".eval/0928-global-theme-geometry/select.png",
    await page.view.screenshot({ encoding: "buffer", format: "png" })
  )
  expect(page.errors).toEqual([])
})

test("global geometry overrides reach an owned overlay portal", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#select/default")
  await pollUntil(() => page.locator('.example-stage [data-slot="select-trigger"]').count())
  await page.locator('.example-stage [data-slot="select-trigger"]').click()
  await pollUntil(() => page.locator('[data-slot="select-content"]').count())
  const popup = page.locator('[data-slot="select-content"]')
  await popup.evaluate(`(element) => {
    const theme = element.closest('[data-bridge-theme]');
    theme.style.setProperty('--bridge-control-radius', '4px');
    theme.style.setProperty('--bridge-space-2', '12px');
  }`)
  expect(await popup.evaluate<string>(`(element) => getComputedStyle(element).borderRadius`)).toBe("4px")
  expect(page.errors).toEqual([])
})
