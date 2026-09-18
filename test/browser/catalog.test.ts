import { readdirSync } from "node:fs"

import { expect, openPage, pollUntil, runAxe, test } from "./support"

const root = "internal/catalog/example"

test("embedded chart geometry survives full catalog navigation", async () => {
  await using page = await openPage()
  await page.goto("/#chart/default")
  for (const name of ["Treemap", "Scatter", "Sankey"]) {
    const frame = page.getByTitle(`Chart ${name} preview`)
    const preview = page.locator(`[data-preview="Chart ${name} preview"]`)
    await pollUntil(() => preview.count())
    await preview.scrollIntoViewIfNeeded()
    await pollUntil(() => frame.count())
    await expect(frame.contentFrame().locator("svg").first()).toBeVisible()
    expect(await frame.contentFrame().locator("svg path, svg rect").count()).toBeGreaterThan(1)
  }
})

for (const count of [2, 4]) {
  test(`calendar range with ${count} months`, async () => {
    await using page = await openPage()
    await page.goto(`/?preview#calendar/range-${count}`)
    const grid = page.getByRole("grid")
    await pollUntil(() => grid.count())
    await expect(grid).toHaveCount(count)
    await page.getByRole("button", { name: "Clear range", exact: true }).click()
    await page.locator('button[data-day="2026-09-10"]').click()
    await page.locator('button[data-day="2026-10-15"]').click()
    await expect(page.getByRole("status", { name: "Selected range" })).toContainText("Sep 10, 2026")
    await expect(page.getByRole("status", { name: "Selected range" })).toContainText("Oct 15, 2026")
  })
}

for (const file of readdirSync(`${root}/chart`)) {
  test(`chart dark ${file}`, async () => {
    await using page = await openPage()
    await page.goto(`/?preview#chart/${file.replace(".tsx", "")}`)
    const chart = page.locator('[data-slot="chart"]').first()
    await pollUntil(() => chart.count())
    await expect(page.locator("html")).toHaveClass("dark")
    await expect(chart).toBeVisible()
    await page.evaluate(`() => document.fonts.ready`)
    const result = await runAxe(page.view)
    expect(result.violations).toEqual([])
  })
}

test("attachment media icon identifies image, video and file", async () => {
  await using page = await openPage()
  await page.goto("/?preview#attachment/media")
  for (const label of ["Image", "Video", "File"]) {
    const img = page.getByRole("img", { name: label, exact: true })
    await pollUntil(() => img.count())
    await expect(img).toBeVisible()
  }
  await expect(page.getByText("landscape.png", { exact: true })).toBeVisible()
  await expect(page.getByText("walkthrough.mp4", { exact: true })).toBeVisible()
  await expect(page.getByText("design-system.pdf", { exact: true })).toBeVisible()
})

for (const name of readdirSync(root)) {
  for (const file of readdirSync(`${root}/${name}`)) {
    const example = file.replace(".tsx", "")
    test(`${name}/${example} renders accessibly`, async () => {
      await using page = await openPage()
      await page.goto(`/?preview&theme=light#${name}/${example}`)
      const stage = page.locator(".example-stage")
      await pollUntil(() => stage.count())
      await expect(stage).toBeVisible()
      if (name === "ts-chart") {
        await expect(page.locator("svg.ts-chart").first()).toBeVisible()
        await expect(page.locator("svg.ts-chart [data-ts-key=marks] > g").first()).toBeAttached()
        await expect(page.getByText("Loading preview...", { exact: true })).toHaveCount(0)
      }
      await expect(page.getByText("Loading preview...")).toHaveCount(0)
      await expect(page.getByText("This example could not render.", { exact: false })).toHaveCount(0)
      await page.evaluate(`() => document.fonts.ready`)
      if (name === "dropdown-menu" && example === "item-variant") {
        const menuButton = page.getByRole("button", { name: "Menu", exact: true })
        await pollUntil(() => menuButton.count())
        await menuButton.click()
        await page.getByRole("menuitem", { name: "Default", exact: true }).focus()
        // The popup has a 100ms entrance animation (opacity 0 -> 1). Sampling axe's
        // color-contrast check mid-animation intermittently computes a blended,
        // under-threshold contrast for the destructive item's red text against the
        // white popup background — flaky, not a real violation. Wait for every
        // running animation to settle first, matching the same pattern used by
        // cmd/verify-secondary-contrast.ts for pseudo-state contrast checks.
        await page.evaluate(`() => Promise.allSettled(document.getAnimations().map((a) => a.finished))`)
      }
      const result = await runAxe(page.view)
      expect(result.violations).toEqual([])
      expect(page.errors).toEqual([])
    })
  }
}

test("browse inline example, source, theme and mobile", async () => {
  await using page = await openPage()
  await page.grantClipboardPermission()
  await page.goto("/#button/default")
  await expect(page.locator("html")).toHaveClass("dark")
  const heading = page.getByRole("heading", { name: "Button", exact: true })
  await pollUntil(() => heading.count())
  await expect(heading).toBeVisible()
  await expect(page.getByLabel("Example", { exact: true })).toHaveCount(0)
  await expect(page.locator("[data-preview]")).toHaveCount(4)
  for (const label of ["Default", "Semantic", "Size", "Variant"]) {
    await expect(page.getByRole("heading", { name: label, exact: true })).toBeVisible()
  }
  await page.getByText("View code", { exact: true }).first().click()
  await expect(page.locator(".code-panel code").first()).toContainText("export default function Example")
  await page.getByRole("button", { name: "Copy code" }).first().click()
  await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible()
  await page.getByLabel("Toggle theme").click()
  await expect(page.locator("html")).not.toHaveClass("dark")
  await page.getByLabel("Find a component").fill("dialog")
  await page.getByRole("link", { name: "Dialog", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Dialog", exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Browse", exact: true }).click()
  await expect(page.getByLabel("Find a component")).toBeVisible()
  const sidebar = page.locator(".catalog-sidebar")
  expect(await sidebar.evaluate<number>(`(node) => node.getBoundingClientRect().right`)).toBeLessThanOrEqual(390)
  expect(
    await page.locator(".header-action").evaluate<number>(`(node) => node.getBoundingClientRect().right`)
  ).toBeLessThanOrEqual(390)
  expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
})

test("core interaction remains executable", async () => {
  await using page = await openPage()
  await page.goto("/?preview#button/default")
  const continueButton = page.getByRole("button", { name: "Continue" })
  await pollUntil(() => continueButton.count())
  await continueButton.click()
  await expect(continueButton).toBeFocused()

  await page.goto("/?preview#input/default")
  const textbox = page.getByRole("textbox")
  await pollUntil(() => textbox.count())
  await textbox.fill("Bridge")
  await expect(textbox).toHaveValue("Bridge")

  await page.goto("/?preview#checkbox/default")
  const checkbox = page.getByRole("checkbox")
  await pollUntil(() => checkbox.count())
  await checkbox.click()
  await expect(checkbox).toBeChecked()

  await page.goto("/?preview#select/default")
  const combobox = page.getByRole("combobox")
  await pollUntil(() => combobox.count())
  await combobox.click()
  await page.getByRole("option").first().click()
  await expect(combobox).not.toHaveText("Select role")

  await page.goto("/?preview#dialog/default")
  const openDialog = page.getByRole("button", { name: "Open dialog" })
  await pollUntil(() => openDialog.count())
  await openDialog.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.pressKey("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)

  await page.goto("/?preview#popover/default")
  const openPopover = page.getByRole("button", { name: "Open popover" })
  await pollUntil(() => openPopover.count())
  await openPopover.click()
  await expect(page.getByRole("dialog")).toBeVisible()

  await page.goto("/?preview#tabs/default")
  const layoutTab = page.getByRole("tab", { name: "Layout packs" })
  await pollUntil(() => layoutTab.count())
  await layoutTab.click()
  await expect(layoutTab).toHaveAttribute("aria-selected", "true")

  await page.goto("/?preview#accordion/default")
  const trigger = page.getByRole("button", { name: "Can I reuse this?" })
  await pollUntil(() => trigger.count())
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")

  await page.goto("/?preview#tooltip/default")
  await page.moveMouse(0, 0)
  const hoverMe = page.getByRole("button", { name: "Hover me" })
  await pollUntil(() => hoverMe.count())
  await hoverMe.hover()
  await expect(page.getByText("Helpful detail", { exact: true })).toBeVisible()

  await page.goto("/?preview#toast/default")
  const showToast = page.getByRole("button", { name: "Show toast" })
  await pollUntil(() => showToast.count())
  await showToast.click()
  await expect(page.getByText("Saved", { exact: true })).toBeVisible()
})
