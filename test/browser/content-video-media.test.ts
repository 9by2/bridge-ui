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
        await Bun.write(
          `${evidence}/${route.replace("/", "-")}-${width}.png`,
          await page.view.screenshot({ encoding: "buffer", format: "png" })
        )
      }
    }
  }
  expect(page.errors).toEqual([])
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
