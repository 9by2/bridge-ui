// Repro: bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p0-runner.test.ts
import { expect, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-consumer-gap-close"

test("P0-1 sonnerToast renders inside SonnerToaster from the package import", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/?preview&theme=light#sonner/default")
  await pollUntil(() => page.getByRole("button", { name: "Success" }).count())
  await page.getByRole("button", { name: "Success" }).click()
  await pollUntil(() => page.getByText("Change saved").count())
  expect(await page.locator("[data-sonner-toast]").count()).toBeGreaterThan(0)
  await pollUntil(async () =>
    (await page.evaluate<boolean>(`() => document.querySelector("[data-sonner-toast]")?.getAttribute("data-mounted") === "true" && getComputedStyle(document.querySelector("[data-sonner-toast]")).opacity === "1"`))
      ? 1
      : 0
  )
  await Bun.sleep(450)
  await Bun.write(`${out}/p0-sonner-success.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
})

test("P0-2 spinner sizes stay announced status at desktop and mobile", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`/?preview&theme=${theme}#spinner/size`)
    await pollUntil(() => page.locator('[data-slot="spinner"]').count())
    expect(
      await page.evaluate<string[]>(
        `() => [...document.querySelectorAll('[data-slot="spinner"]')].map((node) => node.getAttribute("data-size") + ":" + getComputedStyle(node).width)`
      )
    ).toEqual(["sm:12px", "default:16px", "lg:24px", "sm:12px"])
    await Bun.write(`${out}/p0-spinner-${theme}.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  }
})
