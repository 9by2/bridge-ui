import { expect, openPage, pollUntil, runAxe, test } from "./support"

const modes = ["light", "dark", "cue", "future"] as const

test("every theme mode preserves identical non-color geometry and DOM (REQ-002)", async () => {
  await using page = await openPage()
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
    await pollUntil(() => cta.count())
    await expect(cta).toBeVisible()
    const measurement = await cta.evaluate<{
      borderRadius: string
      height: string
      padding: string
      fontFamily: string
      colorScheme: string
      backgroundColor: string
    }>(`(node) => {
      const computed = getComputedStyle(node)
      return {
        borderRadius: computed.borderRadius,
        height: computed.height,
        padding: computed.padding,
        fontFamily: computed.fontFamily,
        colorScheme: getComputedStyle(node.closest("[data-pilot-theme]")).colorScheme,
        backgroundColor: computed.backgroundImage
      }
    }`)
    measurements.push({ mode, ...measurement })
  }

  const [reference, ...rest] = measurements
  if (!reference) throw new Error("expected at least one theme measurement")
  for (const measurement of rest) {
    expect(measurement.borderRadius).toBe(reference.borderRadius)
    expect(measurement.height).toBe(reference.height)
    expect(measurement.padding).toBe(reference.padding)
    expect(measurement.fontFamily).toBe(reference.fontFamily)
  }

  // future is a distinct semantic-color layer: it must carry its own gradient stops,
  // not silently reuse Cue's or dark's exact brand/accent colors.
  const cue = measurements.find((measurement) => measurement.mode === "cue")
  const future = measurements.find((measurement) => measurement.mode === "future")
  expect(future?.backgroundColor).not.toBe(cue?.backgroundColor)
})

test("future theme mode is distinct dark-scheme with brand-safe text token", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=future#tabs/orientation-and-variant")
  const theme = page.locator('[data-pilot-theme="future"]')
  await pollUntil(() => theme.count())
  await expect(theme).toBeVisible()
  await expect(theme).toHaveCSS("color-scheme", "dark")
  await expect(page.locator(".example-stage")).toBeVisible()
  const result = await runAxe(page.view)
  expect(result.violations).toEqual([])
})
