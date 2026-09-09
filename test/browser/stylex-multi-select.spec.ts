import { expect, test } from "@playwright/test"

test("multi select registers label and retains selection across reopen", async ({ page }) => {
  await page.goto("/style-x?preview#multi-select/default")
  const trigger = page.getByRole("combobox", { name: "Select teams" })
  await expect(trigger).toContainText("Design")
  await trigger.focus()
  await page.keyboard.press("Enter")
  await page.getByRole("option", { name: "Design", exact: true }).click()
  await page.keyboard.press("Escape")
  await expect(trigger).not.toContainText("Design")
  await expect(trigger).toContainText("Engineering")
  await trigger.focus()
  await page.keyboard.press("Enter")
  await page.getByRole("option", { name: "Design", exact: true }).click()
  await page.keyboard.press("Escape")
  await expect(trigger).toContainText("Design")
})
