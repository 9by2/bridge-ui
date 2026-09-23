import { expect, openPage, pollUntil, test } from "./support"

test("shared color and font overrides reach compiled Button styling", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#button/default")
  await pollUntil(() => page.locator('.example-stage [data-slot="button"]').count())

  const button = page.locator('.example-stage [data-slot="button"]')
  await page.evaluate(`() => {
    const theme = document.querySelector('[data-bridge-theme]');
    theme.style.setProperty('--bridge-color-primary', 'rgb(12, 34, 56)');
    theme.style.setProperty('--bridge-font-size-base', '19px');
  }`)
  await pollUntil(
    async () =>
      (await button.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)) === "rgb(12, 34, 56)"
  )

  expect(await button.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)).toBe(
    "rgb(12, 34, 56)"
  )
  expect(await button.evaluate<string>(`(element) => getComputedStyle(element).fontSize`)).toBe("19px")
  expect(page.errors).toEqual([])
  if (process.env.BRIDGE_CAPTURE_SHARED_THEME === "1") {
    await Bun.write(
      ".eval/0923-shared-theme-token/screen.png",
      await page.view.screenshot({ encoding: "buffer", format: "png" })
    )
  }
})
