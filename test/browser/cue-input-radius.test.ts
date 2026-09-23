import { expect, openPage, pollUntil, test } from "./support"

test("Cue Input matches Cue control radius and respects Theme override", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=cue#input/default")
  await pollUntil(() => page.locator('.example-stage input[data-slot="input"]').count())
  await pollUntil(() =>
    page.evaluate(
      `() => getComputedStyle(document.querySelector('.example-stage input[data-slot="input"]')).height === '32px'`
    )
  )
  expect(
    await page.view.evaluate<string>(
      `getComputedStyle(document.querySelector('.example-stage input[data-slot="input"]')).borderRadius`
    )
  ).toBe("8px")
  expect(
    await page.view.evaluate<string>(`(() => {
      const input = document.querySelector('.example-stage input[data-slot="input"]');
      input.closest('[data-bridge-theme]').style.setProperty('--bridge-control-radius', '3px');
      return getComputedStyle(input).borderRadius;
    })()`)
  ).toBe("3px")
  await Bun.write(".eval/0923-cue-input/screen.png", await page.view.screenshot({ encoding: "buffer", format: "png" }))
  expect(page.errors).toEqual([])
})
