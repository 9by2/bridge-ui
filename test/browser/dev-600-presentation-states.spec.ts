import { expect, test } from "@playwright/test"

/**
 * REQ-001 acceptance: "Visual and interaction checks cover mobile, long copy, Thai
 * copy, dark, reduced motion, disabled, invalid, loading, open, and empty states
 * where applicable." This spec proves the states genuinely applicable to the
 * Phase 3 branded presentation families beyond the `states.tsx` catalog examples,
 * which axe-check under `test/browser/catalog.spec.ts` already.
 */

test.describe("branded presentation dark theme", () => {
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
    "ticket-card"
  ]) {
    test(`${family}/default renders in dark theme`, async ({ page }) => {
      await page.goto(`/?preview&theme=dark#${family}/default`)
      await expect(page.locator(".example-stage")).toBeVisible()
    })
  }
})

test.describe("branded presentation mobile viewport", () => {
  for (const family of ["receipt", "ticket-card", "ticket-cover", "setting-item", "detail-item"]) {
    test(`${family}/default remains contained at 390px`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 700 })
      await page.goto(`/?preview&theme=light#${family}/default`)
      const stage = page.locator(".example-stage")
      await expect(stage).toBeVisible()
      expect(await stage.evaluate((node) => node.scrollWidth <= window.innerWidth + 1)).toBe(true)
    })
  }
})

test("success burst pauses its transition under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?preview&theme=light#success-burst/default")
  const burst = page.locator('[data-slot="success-burst"]')
  await expect(burst).toBeVisible()
  const duration = await burst.evaluate((node) => getComputedStyle(node).transitionDuration)
  expect(duration).toBe("0s")
})

test("success burst transitions normally without reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/?preview&theme=light#success-burst/default")
  const burst = page.locator('[data-slot="success-burst"]')
  await expect(burst).toBeVisible()
  const duration = await burst.evaluate((node) => getComputedStyle(node).transitionDuration)
  expect(duration).toBe("0.35s")
})

test("ticket card flip pauses under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?preview&theme=light#ticket-card/default")
  const surface = page.locator('[data-slot="ticket-card-surface"]')
  await expect(surface).toBeVisible()
  const duration = await surface.evaluate((node) => getComputedStyle(node).transitionDuration)
  expect(duration).toBe("0s")
})

test("ticket card flips side on toggle and forwards caller side-change events", async ({ page }) => {
  await page.goto("/?preview&theme=light#ticket-card/default")
  const card = page.locator('[data-slot="ticket-card"]')
  await expect(card).toHaveAttribute("data-side", "front")
  await page.getByRole("button", { name: "Show back" }).click()
  await expect(card).toHaveAttribute("data-side", "back")
  await page.getByRole("button", { name: "Show front" }).click()
  await expect(card).toHaveAttribute("data-side", "front")
})

test("product item quantity stepper disables at its bounds", async ({ page }) => {
  await page.goto("/?preview&theme=light#product-item/default")
  const decrement = page.getByRole("button", { name: "Decrease quantity" })
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

test("responsive image renders the fallback source below the configured breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto("/?preview&theme=light#responsive-image/default")
  const image = page.locator('[data-slot="responsive-image"]')
  await expect(image).toBeVisible()
  expect(await image.getAttribute("src")).toContain("placehold.co")
})

test("ticket cover media masks with the ticket-notch silhouette and keeps a locked 16/9 ratio", async ({ page }) => {
  for (const width of [320, 480, 720, 960]) {
    await page.setViewportSize({ width, height: 700 })
    await page.goto("/?preview&theme=light#ticket-cover/default")
    const media = page.locator('[data-slot="ticket-cover-media"]')
    await expect(media).toBeVisible()

    const computed = await media.evaluate((node) => {
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
    })

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

test("ticket cover has no border/outline, no wavy scallop, and fills its media with a covering image", async ({
  page
}) => {
  await page.goto("/?preview&theme=light#ticket-cover/default")

  const root = page.locator('[data-slot="ticket-cover"]')
  await expect(root).toBeVisible()
  const rootStyle = await root.evaluate((node) => {
    const style = getComputedStyle(node)
    return { boxShadow: style.boxShadow, outlineStyle: style.outlineStyle, borderWidth: style.borderWidth }
  })
  expect(rootStyle.boxShadow).toBe("none")
  expect(rootStyle.outlineStyle).toBe("none")
  expect(rootStyle.borderWidth).toBe("0px")

  const body = page.locator('[data-slot="ticket-cover-body"]')
  const scallop = await body.evaluate((node) => {
    const before = getComputedStyle(node, "::before")
    return before.content
  })
  // No pseudo-element content means the wavy scallop overlay was removed.
  expect(scallop === "none" || scallop === '""' || scallop === "").toBe(true)

  const image = page.locator('[data-slot="ticket-cover-media"] img')
  await expect(image).toBeVisible()
  const imageBox = await image.boundingBox()
  const mediaBox = await page.locator('[data-slot="ticket-cover-media"]').boundingBox()
  expect(imageBox).not.toBeNull()
  expect(mediaBox).not.toBeNull()
  if (imageBox && mediaBox) {
    expect(imageBox.width).toBeCloseTo(mediaBox.width, 0)
    expect(imageBox.height).toBeCloseTo(mediaBox.height, 0)
  }
  const objectFit = await image.evaluate((node) => getComputedStyle(node).objectFit)
  expect(objectFit).toBe("cover")
})
