import { expect, openPage, pollUntil, pollValue, test } from "./support"

for (const theme of ["light", "dark"]) {
  test(`compound focus, selection and caller geometry ${theme}`, async () => {
    await using page = await openPage()
    await page.goto(`/style-x?preview&theme=${theme}#combobox/default`)
    const team = page.getByRole("combobox", { name: "Team" })
    await pollUntil(() => team.count())
    await team.fill("Eng")
    await expect(page.getByRole("option", { name: "Engineering" })).toBeVisible()
    await page.pressKey("ArrowDown")
    await page.pressKey("Enter")
    await expect(team).toHaveValue("Engineering")

    await page.goto(`/style-x?preview&theme=${theme}#drawer/default`)
    const openDrawer = page.getByRole("button", { name: "Open drawer" })
    await pollUntil(() => openDrawer.count())
    await openDrawer.click()
    const drawer = page.getByRole("dialog")
    await expect(drawer).toBeVisible()
    const viewportHeight = await page.evaluate<number>(`() => window.innerHeight`)
    await pollValue(
      () => drawer.evaluate<number>(`(node) => Math.round(node.getBoundingClientRect().bottom)`),
      (value) => value === viewportHeight
    )
    expect(await drawer.evaluate<string>(`(node) => getComputedStyle(node).transform`)).not.toBe("none")
    await page.pressKey("Escape")
    await expect(drawer).toHaveCount(0)
    await expect(page.getByRole("button", { name: "Open drawer" })).toBeFocused()

    await page.goto(`/style-x?preview&theme=${theme}#input-otp/default`)
    const otp = page.getByRole("textbox")
    await pollUntil(() => otp.count())
    await otp.fill("123456")
    await expect(otp).toHaveValue("1234")

    for (const family of ["sheet", "alert-dialog"]) {
      await page.goto(`/style-x?preview&theme=${theme}#${family}/default`)
      const opener = page.locator(`[data-slot="${family}-trigger"]`)
      await pollUntil(() => opener.count())
      await opener.click()
      const popup = page.locator(`[data-slot="${family}-content"]`)
      await expect(popup).toBeVisible()
      expect(
        await popup.evaluate<string | null>(
          `(node) => node.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")`
        )
      ).toBe(theme)
      await page.getByRole("button", { name: family === "sheet" ? "Close" : "Cancel", exact: true }).click()
      await expect(popup).toHaveCount(0)
      await expect(opener).toBeFocused()
    }

    await page.goto(`/style-x?preview&theme=${theme}#select/default`)
    const trigger = page.getByRole("combobox", { name: "Role" })
    await pollUntil(() => trigger.count())
    await trigger.click()
    await expect(page.locator(`[data-pilot-theme="${theme}"] [data-slot="select-content"]`)).toBeVisible()
    await page.getByRole("option", { name: "Member" }).click()
    await expect(trigger.locator('[data-slot="select-value"]')).toHaveText("member")
    await expect(trigger).toBeFocused()
    await trigger.press("ArrowDown")
    await expect(page.getByRole("listbox")).toBeVisible()
    await page.pressKey("Escape")
    await expect(trigger).toBeFocused()

    await page.goto(`/style-x?preview&theme=${theme}#input-group/default`)
    const input = page.getByRole("textbox", { name: "Search" })
    await pollUntil(() => input.count())
    await page.locator('[data-slot="input-group-addon"]').click()
    await expect(input).toBeFocused()
    await input.fill("Search value")
    await expect(input).toHaveValue("Search value")
    expect(await input.evaluate<string>(`(node) => getComputedStyle(node).borderTopWidth`)).toBe("0px")
    expect(await input.evaluate<string>(`(node) => getComputedStyle(node).boxShadow`)).toBe("none")

    await page.goto(`/style-x?preview&theme=${theme}#toggle-group/default`)
    const right = page.getByRole("button", { name: "Right" })
    await pollUntil(() => right.count())
    await right.click()
    await expect(page.getByRole("button", { name: "Right" })).toHaveAttribute("aria-pressed", "true")
    await page.pressKey("ArrowLeft")
    await expect(page.getByRole("button", { name: "Left" })).toBeFocused()

    await page.goto(`/style-x?preview&theme=${theme}#item/default`)
    const item = page.locator('[data-slot="item"]')
    await pollUntil(() => item.count())
    await expect(item).toBeVisible()
    expect(await item.evaluate<number>(`(node) => node.getBoundingClientRect().width`)).toBe(320)

    await page.goto(`/style-x?preview&theme=${theme}#label/default`)
    const label = page.locator('[data-slot="label"]')
    await pollUntil(() => label.count())
    await expect(label).toHaveAttribute("for", "story-label")
  })
}
