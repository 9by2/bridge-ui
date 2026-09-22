import { expect, openPage, pollUntil, runAxe, test } from "./support"

type AccessibilityCase = {
  route: string
  name: string
  setup?: (page: Awaited<ReturnType<typeof openPage>>) => Promise<void>
}

const AccessibilityCase: AccessibilityCase[] = [
  { name: "form", route: "field/default" },
  {
    name: "modal portal",
    route: "dialog/default",
    setup: async (page) => {
      await page.getByRole("button", { name: "Open dialog" }).click()
      await expect(page.getByRole("dialog")).toBeVisible()
    }
  },
  {
    name: "menu portal",
    route: "dropdown-menu/default",
    setup: async (page) => {
      await page.getByRole("button", { name: "Open menu" }).click()
      await expect(page.getByRole("menu")).toBeVisible()
    }
  },
  { name: "data table", route: "table/default" },
  { name: "file input", route: "drop-area/default" },
  { name: "owned composite", route: "bridge-calendar/month" },
  { name: "future theme", route: "tabs/orientation-and-variant" }
]

for (const accessibilityCase of AccessibilityCase) {
  test(`${accessibilityCase.name} is accessible`, async () => {
    await using page = await openPage()
    const theme = accessibilityCase.name === "future theme" ? "future" : "light"
    await page.goto(`/?preview&theme=${theme}#${accessibilityCase.route}`)
    const stage = page.locator(".example-stage")
    await pollUntil(() => stage.count())
    await expect(stage).toBeVisible()
    await accessibilityCase.setup?.(page)
    const result = await runAxe(page.view)
    expect(result.violations).toEqual([])
    expect(page.errors).toEqual([])
  })
}
