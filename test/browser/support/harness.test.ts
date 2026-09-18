import { afterAll, describe, expect, test } from "bun:test"

import { runAxe } from "./axe"
import { openPage } from "./page"
import { pollUntil } from "./poll"
import { makeTestPng, uploadFile } from "./upload"
import "./matcher"

describe("webview harness", () => {
  afterAll(() => {
    Bun.WebView.closeAll()
  })

  test("goto navigates and locator reads visible content", async () => {
    await using page = await openPage()
    await page.goto("/?preview#button/default")
    const button = page.locator("button")
    await pollUntil(() => button.count())
    await expect(button).toBeVisible()
    await expect(button).toContainText("Continue")
  })

  test("getByRole matches accessible name and click focuses", async () => {
    await using page = await openPage()
    await page.goto("/?preview#button/default")
    const button = page.getByRole("button", { name: "Continue", exact: true })
    await expect(button).toBeVisible()
    await button.click()
    await expect(button).toBeFocused()
  })

  test("locator.css reads computed style", async () => {
    await using page = await openPage()
    await page.goto("/?preview#button/default")
    const button = page.locator("button")
    await pollUntil(() => button.count())
    const display = await button.css("display")
    expect(typeof display).toBe("string")
    expect(display.length).toBeGreaterThan(0)
  })

  test("chained locator scopes nested queries", async () => {
    await using page = await openPage()
    await page.goto("/?preview&theme=dark#tabs/default")
    const tab = page.getByRole("tab", { name: "Assets" })
    await expect(tab).toBeVisible()
  })

  test("pollUntil resolves once truthy and times out with an error", async () => {
    let calls = 0
    const result = await pollUntil(() => {
      calls += 1
      return calls >= 3 ? "done" : false
    })
    expect(result).toBe("done")

    await expect(pollUntil(() => false, { timeout: 150, interval: 20 })).rejects.toThrow(/timed out/)
  })

  test("runAxe reports no violations on the button preview", async () => {
    await using page = await openPage()
    await page.goto("/?preview&theme=light#button/default")
    const button = page.locator("button")
    await pollUntil(() => button.count())
    const result = await runAxe(page.view)
    expect(result.violations).toEqual([])
  })

  test("upload helper assigns a file to an input", async () => {
    await using page = await openPage()
    await page.goto("/?preview#drop-area/default")
    const input = page.locator('input[type="file"]')
    await pollUntil(() => input.count())
    const dataUrl = await makeTestPng(page.view, 4, 4, "#ff0000")
    await uploadFile(page.view, 'input[type="file"]', dataUrl, "test.png")
    const fileName = await page.view.evaluate<string>(`document.querySelector('input[type="file"]').files[0]?.name`)
    expect(fileName).toBe("test.png")
  })
})
