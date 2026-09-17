import { expect, test } from "@playwright/test"

const modes = ["light", "dark", "cue", "future"] as const

test("every theme mode preserves identical non-color geometry and DOM (REQ-002)", async ({ page }) => {
  const measurements: Array<{
    mode: string
    borderRadius: string
    height: string
    padding: string
    fontFamily: string
    colorScheme: string
    backgroundColor: string
  }> = []
  for (const mode of modes) {
    await page.goto(`/?preview&theme=${mode}#button/variant`)
    const cta = page.getByRole("button", { name: "cta" })
    await expect(cta).toBeVisible()
    const measurement = await cta.evaluate((node) => {
      const computed = getComputedStyle(node)
      return {
        borderRadius: computed.borderRadius,
        height: computed.height,
        padding: computed.padding,
        fontFamily: computed.fontFamily,
        colorScheme: getComputedStyle(node.closest("[data-pilot-theme]")!).colorScheme,
        backgroundColor: computed.backgroundImage
      }
    })
    measurements.push({ mode, ...measurement })
  }

  const [reference, ...rest] = measurements
  for (const measurement of rest) {
    expect(measurement.borderRadius).toBe(reference?.borderRadius)
    expect(measurement.height).toBe(reference?.height)
    expect(measurement.padding).toBe(reference?.padding)
    expect(measurement.fontFamily).toBe(reference?.fontFamily)
  }

  // future is a distinct semantic-color layer: it must carry its own gradient stops,
  // not silently reuse Cue's or dark's exact brand/accent colors.
  const cue = measurements.find((measurement) => measurement.mode === "cue")
  const future = measurements.find((measurement) => measurement.mode === "future")
  expect(future?.backgroundColor).not.toBe(cue?.backgroundColor)
})

test("future theme mode is distinct dark-scheme with brand-safe text token", async ({ page }) => {
  await page.goto("/?preview&theme=future#tabs/orientation-and-variant")
  const theme = page.locator('[data-pilot-theme="future"]')
  await expect(theme).toBeVisible()
  await expect(theme).toHaveCSS("color-scheme", "dark")
  await expect(page.locator(".example-stage")).toBeVisible()
  expect((await new (await import("@axe-core/playwright")).default({ page }).analyze()).violations).toEqual([])
})
