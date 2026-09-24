// Repro: bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p2-runner.test.ts
import { expect, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-consumer-gap-close"

test("P2-1 prose typography renders mixed Thai/English at desktop and mobile", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1280, height: 1000 })
    await page.goto(`/?preview&theme=${theme}#typography/prose`)
    await pollUntil(() => page.locator('[data-slot="blockquote"]').count())
    expect(await page.locator('[data-slot="list"][data-ordered="true"]').count()).toBe(1)
    await Bun.write(`${out}/p2-prose-${theme}.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  }
})

test("P2-2 real broken image swaps once to fallback", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto("/?preview&theme=light#responsive-image/fallback")
  const broken = page.getByRole("img", { name: "Missing venue photo" })
  await pollUntil(() => broken.count())
  await pollUntil(async () =>
    (await page.evaluate<boolean>(
      `() => { const img = document.querySelector('[alt="Missing venue photo"]'); return img.dataset.fallback === "true" && img.complete && img.naturalWidth > 0 }`
    ))
      ? 1
      : 0
  )
  expect(
    await page.evaluate<string>(`() => document.querySelector('[alt="Missing venue photo"]').getAttribute("src").slice(0, 19)`)
  ).toBe("data:image/svg+xml;")
  await Bun.write(`${out}/p2-image-fallback.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
})

test("P2-3 route action injects, switches and clears in the shell header", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 700 })
  await page.goto("/?preview&theme=light#shell-header/action")
  const header = page.locator('[data-slot="shell-header-action"]')
  await pollUntil(() => header.count())
  await expect(header).toContainText("New event")
  await Bun.write(`${out}/p2-shell-action-schedule.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.getByRole("button", { name: "Report" }).click()
  await expect(header).toContainText("Export")
  await page.getByRole("button", { name: "No action" }).click()
  await pollUntil(async () => ((await header.count()) === 0 ? 1 : 0))
  expect(await header.count()).toBe(0)
})

test("P2-4 multi-select separator renders between groups", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 700 })
  await page.goto("/?preview&theme=light#multi-select/separator")
  const trigger = page.getByRole("combobox", { name: "Select teams" })
  await pollUntil(() => trigger.count())
  await trigger.click()
  await pollUntil(() => page.locator('[data-slot="command-separator"]').count())
  await Bun.write(`${out}/p2-multi-select-separator.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
})
