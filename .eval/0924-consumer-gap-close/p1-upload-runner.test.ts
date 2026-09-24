// Repro: bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-upload-runner.test.ts
import { expect, makeTestPng, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-consumer-gap-close"

async function select(page: Awaited<ReturnType<typeof openPage>>, file: { name: string; type: string; dataUrl?: string }[]) {
  await page.evaluate(`async () => {
    const input = document.querySelector('input[type="file"]')
    const transfer = new DataTransfer()
    for (const item of ${JSON.stringify(file)}) {
      const blob = item.dataUrl ? await (await fetch(item.dataUrl)).blob() : new Blob(["x"], { type: item.type })
      transfer.items.add(new File([blob], item.name, { type: item.type }))
    }
    input.files = transfer.files
    input.dispatchEvent(new Event("change", { bubbles: true }))
  }`)
}

test("P1-3 grid validation shows inline issue, thumbnail tile and event log", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`/?preview&theme=${theme}#upload-list/validation`)
    await pollUntil(() => page.locator('input[type="file"]').count())
    const red = await makeTestPng(page.view, 64, 64, "#e11d48")
    const blue = await makeTestPng(page.view, 64, 64, "#2563eb")
    await select(page, [
      { name: "red.png", type: "image/png", dataUrl: red },
      { name: "blue.png", type: "image/png", dataUrl: blue },
      { name: "notes.pdf", type: "application/pdf" }
    ])
    await expect(page.getByRole("alert")).toContainText("notes.pdf")
    await pollUntil(() => page.locator('[data-slot="upload-preview"][data-variant="tile"]').count())
    expect(await page.locator('[data-slot="upload-preview"][data-variant="tile"]').count()).toBe(2)
    await expect(page.getByLabel("Upload event log")).toContainText("change: append red.png, blue.png")
    await expect(page.getByLabel("Upload event log")).toContainText("issue: file-invalid-type")
    await Bun.write(`${out}/p1-upload-grid-${theme}-desktop.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
    await Bun.write(`${out}/p1-upload-grid-${theme}-mobile.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  }
})

test("P1-3 single mode replaces and reports reason", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/?preview&theme=light#upload-list/single")
  await pollUntil(() => page.locator('input[type="file"]').count())
  await select(page, [{ name: "contract-v2.pdf", type: "application/pdf" }])
  await expect(page.getByText("Last change reason: replace")).toBeVisible()
  expect(await page.getByText("contract-v1.pdf").count()).toBe(0)
  await expect(page.getByRole("button", { name: "Remove contract-v2.pdf" })).toBeVisible()
  await Bun.write(`${out}/p1-upload-single-replace.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
})
