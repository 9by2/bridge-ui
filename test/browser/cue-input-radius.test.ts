import { expect, openPage, pollUntil, test } from "./support"

test("Cue Input matches Cue control radius and respects Theme override", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=cue#input/default")
  for (const [width, fontSize, radius] of [
    [390, "16px", "8px"],
    [1280, "14px", "7px"]
  ] as const) {
    await page.setViewportSize({ width, height: 720 })
    await page.reload()
    await pollUntil(() => page.locator('.example-stage input[data-slot="input"]').count())
    await pollUntil(() =>
      page.evaluate(
        `() => getComputedStyle(document.querySelector('.example-stage input[data-slot="input"]')).height === '32px'`
      )
    )
    const computed = await page.view.evaluate<{ fontSize: string; radius: string }>(`(() => {
      const style = getComputedStyle(document.querySelector('.example-stage input[data-slot="input"]'));
      return { fontSize: style.fontSize, radius: style.borderRadius };
    })()`)
    expect(computed.fontSize).toBe(fontSize)
    expect(computed.radius).toBe(radius)
    expect(
      await page.view.evaluate<string>(
        `document.querySelector('.example-stage input[data-slot="input"]').closest('[data-bridge-theme]').style.getPropertyValue('--bridge-control-radius')`
      )
    ).toBe("")
    expect(
      await page.view.evaluate<string>(
        `getComputedStyle(document.querySelector('.example-stage input[data-slot="input"]').closest('[data-bridge-theme]')).getPropertyValue('--bridge-control-radius').trim()`
      )
    ).toBe(".5em")
    expect(
      await page.view.evaluate<string>(`(() => {
        const input = document.querySelector('.example-stage input[data-slot="input"]');
        input.closest('[data-bridge-theme]').style.setProperty('--bridge-control-radius', '0.25em');
        return getComputedStyle(input).borderRadius;
      })()`)
    ).toBe(width === 390 ? "4px" : "3.5px")
  }
  await Bun.write(".eval/0923-cue-input/screen.png", await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.goto("/?preview&theme=light#input/default")
  await pollUntil(() =>
    page.evaluate(
      `() => getComputedStyle(document.querySelector('.example-stage input[data-slot="input"]')).borderRadius === '10px'`
    )
  )
  expect(page.errors).toEqual([])
})
