import { expect, openPage, pollUntil, test } from "./support"

test("host CSS brand override updates a compiled success badge", async () => {
  await using page = await openPage()
  await page.goto("/?preview#badge/variant")
  const badge = page.getByText("success", { exact: true })
  await pollUntil(() => badge.count())

  const before = await badge.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)
  await page.evaluate(
    `() => document.querySelector('[data-bridge-theme]').style.setProperty('--bridge-color-brand', 'rgb(12, 34, 56)')`
  )
  await pollUntil(
    async () =>
      (await badge.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)) === "rgb(12, 34, 56)"
  )

  expect(await badge.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)).toBe("rgb(12, 34, 56)")
  expect(before).not.toBe("rgb(12, 34, 56)")
  if (process.env.BRIDGE_CAPTURE_BRAND === "1") {
    await Bun.write(
      ".eval/0923-brand-color-variable/override.png",
      await page.view.screenshot({ encoding: "buffer", format: "png" })
    )
  }
})
