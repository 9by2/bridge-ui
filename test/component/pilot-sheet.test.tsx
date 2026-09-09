import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
} from "../../app/component/brand/stylex/sheet"
import { Theme } from "../../app/component/brand/stylex/theme"

afterEach(cleanup)
test("sheet caller style and optional close remain supported", () => {
  render(
    <Sheet open>
      <SheetContent showCloseButton={false} className={() => "popup"}>
        <SheetTitle className={() => "title"}>Title</SheetTitle>
        <SheetDescription className={() => "description"}>Copy</SheetDescription>
      </SheetContent>
    </Sheet>
  )
  expect(screen.getByRole("dialog").className).toContain("popup")
  expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
})
test("sheet retains controlled close and themed portal on every side", async () => {
  for (const side of ["left", "right", "top", "bottom"] as const) {
    const change = vi.fn()
    const { unmount } = render(
      <Theme mode="dark">
        <Sheet open onOpenChange={change}>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Title</SheetTitle>
              <SheetDescription>Copy</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose>Cancel</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Theme>
    )
    const dialog = await screen.findByRole("dialog")
    expect(dialog.getAttribute("data-side")).toBe(side)
    expect(dialog.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("dark")
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(change.mock.calls[0]?.[0]).toBe(false)
    unmount()
  }
})
