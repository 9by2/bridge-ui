import { expect, test } from "@playwright/test"

test("capsule tab fills only the active trigger", async ({ page }) => {
  await page.goto("/?preview&theme=dark#tabs/capsule")

  const list = page.locator('[data-variant="capsule"]')
  const active = list.first().getByRole("tab", { name: "Assets" })
  const inactive = list.first().getByRole("tab", { name: "Layout packs" })
  const badge = list.getByRole("tab", { name: "Colors 32" }).locator('[data-slot="badge"]')

  await expect(active).toHaveCSS("border-radius", "999px")
  await expect(active).toHaveCSS("padding-left", "10px")
  await expect(active).toHaveCSS("padding-top", "4px")
  await expect(active).not.toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  await expect(inactive).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
  await expect(inactive).toHaveCSS("border-width", "0px")
  // Badge self-declares its own pill radius (26px); at its 20px height that already
  // clips to a fully rounded pill, so no capsule-context override is required.
  await expect(badge).toHaveCSS("border-radius", "26px")
})
