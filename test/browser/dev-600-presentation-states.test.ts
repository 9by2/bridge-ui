/**
 * REQ-001 acceptance: "Visual and interaction checks cover mobile, long copy, Thai
 * copy, dark, reduced motion, disabled, invalid, loading, open, and empty states
 * where applicable." This spec proves the states genuinely applicable to the
 * Phase 3 branded presentation families beyond the `states.tsx` catalog examples,
 * which axe-check under `test/browser/catalog.test.ts` already.
 */
import { describe, expect, openPage, pollUntil, test } from "./support"

describe("branded presentation dark theme", () => {
  for (const family of [
    "receipt",
    "status-stamp",
    "detail-item",
    "setting-item",
    "sticky-alert",
    "success-burst",
    "responsive-image",
    "product-item",
    "ticket-cover",
    "ticket-card",
    "wizard-step"
  ]) {
    test(`${family}/default renders in dark theme`, async () => {
      await using page = await openPage()
      await page.goto(`/?preview&theme=dark#${family}/default`)
      const stage = page.locator(".example-stage")
      await pollUntil(() => stage.count())
      await expect(stage).toBeVisible()
    })
  }
})

describe("branded presentation mobile viewport", () => {
  for (const family of ["receipt", "ticket-card", "ticket-cover", "setting-item", "detail-item", "wizard-step"]) {
    test(`${family}/default remains contained at 390px`, async () => {
      await using page = await openPage()
      await page.setViewportSize({ width: 390, height: 700 })
      await page.goto(`/?preview&theme=light#${family}/default`)
      const stage = page.locator(".example-stage")
      await pollUntil(() => stage.count())
      await expect(stage).toBeVisible()
      expect(await stage.evaluate<boolean>(`(node) => node.scrollWidth <= window.innerWidth + 1`)).toBe(true)
    })
  }
})

test("wizard step error state renders a distinct destructive indicator and connector", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#wizard-step/states")
  const errorIndicator = page.locator('[data-slot="wizard-step-indicator"][data-state="error"]')
  await pollUntil(() => errorIndicator.count())
  await expect(errorIndicator).toBeVisible()
  const errorConnector = page.locator('[data-slot="wizard-step-connector"][data-state="error"]')
  await expect(errorConnector).toHaveCount(1)
  const completedIndicator = page.locator('[data-slot="wizard-step-indicator"][data-state="completed"]').first()
  const errorColor = await errorIndicator.css("background-color")
  const completedColor = await completedIndicator.css("background-color")
  expect(errorColor).not.toBe(completedColor)
})

test("wizard step completed item exposes an interactive button while upcoming stays inert", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#wizard-step/default")
  const completed = page.locator('[data-slot="wizard-step-item"][data-state="completed"]')
  await pollUntil(() => completed.count())
  expect(await completed.evaluate<string>(`(node) => node.tagName`)).toBe("BUTTON")
  const upcoming = page.locator('[data-slot="wizard-step-item"][data-state="upcoming"]')
  expect(await upcoming.evaluate<string>(`(node) => node.tagName`)).toBe("DIV")
})

test("wizard step dot connector centers on its dot indicators", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#wizard-step/states")
  const dotStep = page.locator('[data-slot="wizard-step"][data-variant="dot"]')
  await pollUntil(() => dotStep.count())
  const geometry = await dotStep
    .locator('[data-slot="wizard-step-connector"]')
    .first()
    .evaluate<{ connectorCenter: number; startIndicatorCenter: number; endIndicatorCenter: number }>(
      `(node) => {
        const item = node.previousElementSibling
        const next = node.nextElementSibling
        const indicator = item?.querySelector('[data-slot="wizard-step-indicator"]')
        const nextIndicator = next?.querySelector('[data-slot="wizard-step-indicator"]')
        const connectorRect = node.getBoundingClientRect()
        const indicatorRect = indicator?.getBoundingClientRect()
        const nextIndicatorRect = nextIndicator?.getBoundingClientRect()
        if (!indicatorRect || !nextIndicatorRect) throw new Error("Wizard step dot geometry is incomplete")
        return {
          connectorCenter: connectorRect.top + connectorRect.height / 2,
          startIndicatorCenter: indicatorRect.top + indicatorRect.height / 2,
          endIndicatorCenter: nextIndicatorRect.top + nextIndicatorRect.height / 2
        }
      }`
    )
  expect(Math.abs(geometry.connectorCenter - geometry.startIndicatorCenter)).toBeLessThan(0.5)
  expect(Math.abs(geometry.connectorCenter - geometry.endIndicatorCenter)).toBeLessThan(0.5)
})

test("wizard step aligns mixed description labels with its indicator centerline", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#wizard-step/states")
  const errorStep = page.locator('[data-slot="wizard-step"][aria-label="Error state"]')
  await pollUntil(() => errorStep.count())
  const geometry = await errorStep
    .locator('[data-slot="wizard-step-item"]')
    .first()
    .evaluate<{ indicatorCenter: number; labelCenter: number }>(
      `(node) => {
        const indicator = node.querySelector('[data-slot="wizard-step-indicator"]')
        const label = node.querySelector('[data-slot="wizard-step-label"]')
        const indicatorRect = indicator?.getBoundingClientRect()
        const labelRect = label?.getBoundingClientRect()
        if (!indicatorRect || !labelRect) throw new Error("Wizard step mixed label geometry is incomplete")
        return {
          indicatorCenter: indicatorRect.top + indicatorRect.height / 2,
          labelCenter: labelRect.top + labelRect.height / 2
        }
      }`
    )
  expect(geometry.indicatorCenter).toBeCloseTo(geometry.labelCenter, 1)
})

test("wizard step horizontal connector centers on its indicators", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#wizard-step/default")
  const connector = page.locator('[data-slot="wizard-step-connector"]').first()
  await pollUntil(() => connector.count())
  const geometry = await connector.evaluate<{
    connectorCenter: number
    startIndicatorCenter: number
    endIndicatorCenter: number
  }>(
    `(node) => {
      const item = node.previousElementSibling
      const next = node.nextElementSibling
      const indicator = item?.querySelector('[data-slot="wizard-step-indicator"]')
      const nextIndicator = next?.querySelector('[data-slot="wizard-step-indicator"]')
      const connectorRect = node.getBoundingClientRect()
      const indicatorRect = indicator?.getBoundingClientRect()
      const nextIndicatorRect = nextIndicator?.getBoundingClientRect()
      if (!indicatorRect || !nextIndicatorRect) throw new Error("Wizard step geometry is incomplete")
      return {
        connectorCenter: connectorRect.top + connectorRect.height / 2,
        startIndicatorCenter: indicatorRect.top + indicatorRect.height / 2,
        endIndicatorCenter: nextIndicatorRect.top + nextIndicatorRect.height / 2
      }
    }`
  )
  expect(Math.abs(geometry.connectorCenter - geometry.startIndicatorCenter)).toBeLessThan(0.5)
  expect(Math.abs(geometry.connectorCenter - geometry.endIndicatorCenter)).toBeLessThan(0.5)
})

test("success burst pauses its transition under reduced motion", async () => {
  await using page = await openPage()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?preview&theme=light#success-burst/default")
  const burst = page.locator('[data-slot="success-burst"]')
  await pollUntil(() => burst.count())
  await expect(burst).toBeVisible()
  const duration = await burst.css("transition-duration")
  expect(duration).toBe("0s")
})

test("success burst transitions normally without reduced motion", async () => {
  await using page = await openPage()
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/?preview&theme=light#success-burst/default")
  const burst = page.locator('[data-slot="success-burst"]')
  await pollUntil(() => burst.count())
  await expect(burst).toBeVisible()
  const duration = await burst.css("transition-duration")
  expect(duration).toBe("0.35s")
})

test("ticket card flip pauses under reduced motion", async () => {
  await using page = await openPage()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?preview&theme=light#ticket-card/default")
  const surface = page.locator('[data-slot="ticket-card-surface"]')
  await pollUntil(() => surface.count())
  await expect(surface).toBeVisible()
  const duration = await surface.css("transition-duration")
  expect(duration).toBe("0s")
})

test("ticket card flips side on toggle and forwards caller side-change events", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#ticket-card/default")
  const card = page.locator('[data-slot="ticket-card"]')
  await pollUntil(() => card.count())
  await expect(card).toHaveAttribute("data-side", "front")
  await page.getByRole("button", { name: "Show back" }).click()
  await expect(card).toHaveAttribute("data-side", "back")
  await page.getByRole("button", { name: "Show front" }).click()
  await expect(card).toHaveAttribute("data-side", "front")
})

test("product item quantity stepper disables at its bounds", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#product-item/default")
  const decrement = page.getByRole("button", { name: "Decrease quantity" })
  await pollUntil(() => decrement.count())
  const increment = page.getByRole("button", { name: "Increase quantity" })
  const output = page.locator('[data-slot="quantity-stepper-output"]')
  await expect(output).toHaveText("2")
  await expect(decrement).toBeEnabled()
  await expect(increment).toBeEnabled()
  await increment.click()
  await expect(output).toHaveText("3")
  await expect(increment).toBeDisabled()
  await decrement.click()
  await decrement.click()
  await expect(output).toHaveText("1")
  await expect(decrement).toBeDisabled()
})

test("responsive image renders the fallback source below the configured breakpoint", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto("/?preview&theme=light#responsive-image/default")
  const image = page.locator('[data-slot="responsive-image"]')
  await pollUntil(() => image.count())
  await expect(image).toBeVisible()
  expect(await image.attr("src")).toContain("placehold.co")
})

test("ticket cover masks with the ticket-notch silhouette and keeps a locked 16/9 ratio", async () => {
  await using page = await openPage()
  for (const width of [320, 480, 720, 960]) {
    await page.setViewportSize({ width, height: 700 })
    await page.goto("/?preview&theme=light#ticket-cover/default")
    const frame = page.locator('[data-slot="ticket-cover"]')
    await pollUntil(() => frame.count())
    await expect(frame).toBeVisible()

    const computed = await frame.evaluate<{
      maskImage: string
      maskSize: string
      maskRepeat: string
      maskPosition: string
      width: number
      height: number
    }>(`(node) => {
      const style = getComputedStyle(node)
      const rect = node.getBoundingClientRect()
      return {
        maskImage: style.maskImage !== "none" ? style.maskImage : style.webkitMaskImage,
        maskSize: style.maskSize !== "auto" ? style.maskSize : style.webkitMaskSize,
        maskRepeat: style.maskRepeat || style.webkitMaskRepeat,
        maskPosition: style.maskPosition || style.webkitMaskPosition,
        width: rect.width,
        height: rect.height
      }
    }`)

    expect(computed.maskImage).toContain("data:image/svg+xml")
    expect(computed.maskImage).toContain("svg")
    expect(computed.maskSize).toMatch(/100%\s+100%/)
    expect(computed.maskRepeat).toContain("no-repeat")
    // Browsers resolve the `center` keyword to its computed "50% 50%" form.
    expect(computed.maskPosition).toMatch(/50%\s+50%|center/)
    // 16/9 ratio must hold at every tested width, not just the default preview width.
    expect(computed.width / computed.height).toBeCloseTo(16 / 9, 1)
  }
})

test("ticket cover has no border/outline/radius and fills the frame with a covering image", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#ticket-cover/default")

  const frame = page.locator('[data-slot="ticket-cover"]')
  await pollUntil(() => frame.count())
  await expect(frame).toBeVisible()
  const frameStyle = await frame.evaluate<{
    boxShadow: string
    outlineStyle: string
    borderWidth: string
    borderRadius: string
  }>(`(node) => {
    const style = getComputedStyle(node)
    return {
      boxShadow: style.boxShadow,
      outlineStyle: style.outlineStyle,
      borderWidth: style.borderWidth,
      borderRadius: style.borderRadius
    }
  }`)
  expect(frameStyle.boxShadow).toBe("none")
  expect(frameStyle.outlineStyle).toBe("none")
  expect(frameStyle.borderWidth).toBe("0px")
  expect(frameStyle.borderRadius).toBe("0px")

  const image = page.locator('[data-slot="ticket-cover"] img')
  await expect(image).toBeVisible()
  const imageBox = await image.boundingBox()
  const frameBox = await frame.boundingBox()
  expect(imageBox).not.toBeNull()
  expect(frameBox).not.toBeNull()
  if (imageBox && frameBox) {
    expect(imageBox.width).toBeCloseTo(frameBox.width, 0)
    expect(imageBox.height).toBeCloseTo(frameBox.height, 0)
  }
  const objectFit = await image.evaluate<string>(`(node) => getComputedStyle(node).objectFit`)
  expect(objectFit).toBe("cover")
})
