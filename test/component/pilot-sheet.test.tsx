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
test("sheet content opt-in enables side-aware resizing", async () => {
  for (const side of ["left", "right", "top", "bottom"] as const) {
    const { unmount } = render(
      <Sheet open>
        <SheetContent side={side} resizable>
          <SheetTitle>Resizable</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    const dialog = await screen.findByRole("dialog")
    expect(dialog.getAttribute("data-resizable")).toBe("true")
    expect(side === "left" || side === "right" ? dialog.style.maxWidth : dialog.style.maxHeight).toBe(
      side === "left" || side === "right" ? "80vw" : "70vh"
    )
    expect(
      screen.getByRole("separator", { name: side === "left" || side === "right" ? "Resize width" : "Resize height" })
    )
    unmount()
  }
})
test("sheet content accepts a side-specific maximum dimension", async () => {
  const { unmount } = render(
    <Sheet open>
      <SheetContent side="right" resizable maxWidth="48rem">
        <SheetTitle>Resizable</SheetTitle>
      </SheetContent>
    </Sheet>
  )
  expect((await screen.findByRole("dialog")).style.maxWidth).toBe("48rem")
  unmount()
})
test("sheet keeps header and close control outside the long-content scroll viewport", async () => {
  render(
    <Sheet open>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sticky header</SheetTitle>
        </SheetHeader>
        <div style={{ height: "300vh" }}>Long content</div>
      </SheetContent>
    </Sheet>
  )
  const viewport = await screen.findByTestId("sheet-content-viewport")
  expect(viewport.contains(screen.getByText("Long content"))).toBe(true)
  expect(viewport.contains(screen.getByText("Sticky header"))).toBe(true)
  expect(viewport.contains(screen.getByRole("button", { name: "Close" }))).toBe(false)
})
test("sheet resize handle changes the permitted dimension", async () => {
  const change = vi.fn()
  const { unmount } = render(
    <Sheet open>
      <SheetContent side="right" resizable size={320} onSizeChange={change}>
        <SheetTitle>Resizable</SheetTitle>
      </SheetContent>
    </Sheet>
  )
  const dialog = await screen.findByRole("dialog")
  const handle = screen.getByRole("separator", { name: "Resize width" })
  fireEvent.pointerDown(handle, { pointerId: 1, clientX: 100, clientY: 0 })
  fireEvent.pointerMove(handle, { pointerId: 1, clientX: 40, clientY: 0 })
  expect(change).toHaveBeenLastCalledWith(380)
  expect(dialog.style.width).toBe("320px")
  unmount()
})
test("sheet close guard can keep the sheet open", async () => {
  const change = vi.fn()
  render(
    <Sheet open onOpenChange={change} onClose={() => false}>
      <SheetContent>
        <SheetTitle>Guarded</SheetTitle>
      </SheetContent>
    </Sheet>
  )
  fireEvent.click(await screen.findByRole("button", { name: "Close" }))
  expect(change).not.toHaveBeenCalled()
  expect(screen.getByRole("dialog")).toBeTruthy()
})
test("sheet permits close requests when its guard allows them", async () => {
  const change = vi.fn()
  render(
    <Sheet open onOpenChange={change} onClose={() => true}>
      <SheetContent>
        <SheetTitle>Guarded</SheetTitle>
      </SheetContent>
    </Sheet>
  )
  fireEvent.click(await screen.findByRole("button", { name: "Close" }))
  expect(change.mock.calls[0]?.[0]).toBe(false)
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
