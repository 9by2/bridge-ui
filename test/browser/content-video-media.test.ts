import { expect, openPage, pollUntil, test } from "./support"

const evidence = ".eval/0929-content-video-media"

test("short and long content stays readable on desktop and mobile", async () => {
  await using page = await openPage()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 })
    for (const route of ["rich-content/default", "rich-content/long", "rich-content/empty", "video-player/default"]) {
      await page.goto(`/?preview&theme=light#${route}`)
      await pollUntil(() => page.locator(".example-stage").count())
      await pollUntil(() => page.locator('[data-slot="rich-content"], [data-slot="video-player"]').count())
      await expect(page.locator(".example-stage")).toBeVisible()
      expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
      if (route === "rich-content/long" || route === "video-player/default") {
        await pollUntil(() =>
          page.evaluate<boolean>(
            `() => [...document.images].every((image) => image.complete && image.naturalWidth > 0)`
          )
        )
        await Bun.write(
          `${evidence}/${route.replace("/", "-")}-${width}.png`,
          await page.view.screenshot({ encoding: "buffer", format: "png" })
        )
      }
    }
  }
  expect(page.errors).toEqual([])
})

// Protects: a real failed network image advances to the next poster candidate (browser-only load/error lifecycle).
test("video thumbnail falls back to the next candidate after a failed load", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#video-thumbnail/fallback")
  const image = page.locator('[data-slot="video-thumbnail"]')
  await pollUntil(() => image.count())
  await pollUntil(() =>
    page.evaluate<boolean>(
      `() => { const image = document.querySelector('[data-slot="video-thumbnail"]'); return image.src.includes("Fallback") && image.complete && image.naturalWidth > 0 }`
    )
  )
  await Bun.write(
    `${evidence}/video-thumbnail-fallback.png`,
    await page.view.screenshot({ encoding: "buffer", format: "png" })
  )
})

test("video play button supports keyboard activation before iframe request", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#video-player/minimal")
  await pollUntil(() => page.locator('[data-slot="video-player"] button').count())
  expect(await page.locator('[data-slot="video-player"] iframe').count()).toBe(0)
  await page.locator('[data-slot="video-player"] button').focus()
  await page.pressKey("Enter")
  await pollUntil(() => page.locator('[data-slot="video-player"] iframe').count())
  expect(await page.locator('[data-slot="video-player"] iframe').count()).toBe(1)
  expect(page.errors).toEqual([])
})

// Protects: the play affordance stays readable in dark theme (defect: white glyph on white primary) and over
// bright or dark posters. Glyph vs fill is text contrast (4.5:1); the circle needs 3:1 against the poster via fill or ring.
test("video play icon keeps contrast in light and dark over bright and dark posters", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"]) {
    for (const route of ["video-player/poster-contrast", "rich-content/media"]) {
      await page.goto(`/?preview&theme=${theme}#${route}`)
      await pollUntil(() => page.locator('[data-slot="video-player"] button span').count())
      const result = await page.evaluate<{ glyph: number; edge: number }[]>(`() => {
        const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true })
        const rgb = (color) => { canvas.clearRect(0, 0, 1, 1); canvas.fillStyle = "#fff"; canvas.fillRect(0, 0, 1, 1); canvas.fillStyle = color; canvas.fillRect(0, 0, 1, 1); return [...canvas.getImageData(0, 0, 1, 1).data].slice(0, 3) }
        const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
        const ratio = (a, b) => { const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
        return [...document.querySelectorAll('[data-slot="video-player"]')].map((player) => {
          const icon = getComputedStyle(player.querySelector("button span"))
          const surface = player.querySelector("[data-poster]")
          const poster = surface ? getComputedStyle(surface).backgroundColor : getComputedStyle(player).backgroundColor
          return { glyph: ratio(icon.color, icon.backgroundColor), edge: Math.max(ratio(icon.backgroundColor, poster), ratio(icon.borderTopColor, poster)) }
        })
      }`)
      expect(result.length, `${theme} ${route}`).toBeGreaterThan(0)
      for (const item of result) {
        expect(item.glyph, `${theme} ${route} glyph`).toBeGreaterThanOrEqual(4.5)
        expect(item.edge, `${theme} ${route} edge`).toBeGreaterThanOrEqual(3)
      }
      if (route === "video-player/poster-contrast")
        await Bun.write(
          `.eval/0929-rich-content-document/play-icon-${theme}.png`,
          await page.view.screenshot({ encoding: "buffer", format: "png" })
        )
    }
  }
})
