import { expect, test } from "@playwright/test"

test("line tab uses only a primary active underline", async ({ page }) => {
  await page.goto("/?preview&theme=dark#tabs/line")

  const line = page.locator('[data-variant="line"]').first()
  const active = line.getByRole("tab", { name: "Assets" })
  const icon = page.getByRole("tab", { name: "Todo 4" }).locator("svg")

  const appearance = await active.evaluate((node) => {
    const style = getComputedStyle(node)
    return {
      background: style.backgroundColor,
      borderBottomWidth: style.borderBottomWidth,
      borderLeftWidth: style.borderLeftWidth,
      borderRightWidth: style.borderRightWidth,
      borderTopWidth: style.borderTopWidth,
      color: style.color,
      underline: style.borderBottomColor
    }
  })
  expect(appearance).toMatchObject({
    background: "rgba(0, 0, 0, 0)",
    borderBottomWidth: "1px",
    borderLeftWidth: "0px",
    borderRightWidth: "0px",
    borderTopWidth: "0px"
  })
  expect(appearance.color).toBe(appearance.underline)
  await expect(icon).toHaveCSS("width", "16px")
  await expect(icon).toHaveCSS("height", "16px")
})
