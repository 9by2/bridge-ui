import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { ShellHeader, ShellHeaderAction, ShellHeaderTitle } from "../../app/component/brand/stylex/shell-header"

afterEach(cleanup)

test("shell header retains semantic slot, native prop, class and title-only composition", () => {
  render(
    <ShellHeader aria-label="Application header" className="caller">
      <ShellHeaderTitle className="title-caller">User</ShellHeaderTitle>
    </ShellHeader>
  )

  const header = screen.getByRole("banner", { name: "Application header" })
  const title = screen.getByRole("heading", { level: 1, name: "User" })

  expect(header.tagName).toBe("HEADER")
  expect(header.getAttribute("data-slot")).toBe("shell-header")
  expect(header.className).toContain("caller")
  expect(header.className).not.toBe("caller")
  expect(title.getAttribute("data-slot")).toBe("shell-header-title")
  expect(title.className).toContain("title-caller")
  expect(document.querySelector('[data-slot="shell-header-action"]')).toBeNull()
})

test("shell header composes an optional trailing action and long route title", () => {
  const longTitle = "User access and organization membership administration for the international support team"
  render(
    <ShellHeader>
      <button aria-label="Toggle navigation">Toggle</button>
      <ShellHeaderTitle>{longTitle}</ShellHeaderTitle>
      <ShellHeaderAction className="action-caller">
        <button>Search</button>
      </ShellHeaderAction>
    </ShellHeader>
  )

  expect(screen.getByRole("heading", { name: longTitle })).not.toBeNull()
  expect(screen.getByRole("button", { name: "Search" }).parentElement?.getAttribute("data-slot")).toBe(
    "shell-header-action"
  )
  expect(screen.getByRole("button", { name: "Search" }).parentElement?.className).toContain("action-caller")
})
