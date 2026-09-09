import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal
} from "../../internal/pilot/drawer"

afterEach(cleanup)
test("drawer empty snap and explicit overlay callback", () => {
  render(
    <Drawer open snapPoints={[]}>
      <DrawerPortal>
        <DrawerOverlay className={() => "overlay"} />
      </DrawerPortal>
      <DrawerContent>
        <DrawerTitle>Title</DrawerTitle>
        <DrawerDescription>Copy</DrawerDescription>
      </DrawerContent>
    </Drawer>
  )
  expect(document.querySelector(".overlay")).not.toBeNull()
})
test("drawer rejects missing provider and supports nonmodal callback style", () => {
  expect(() => render(<DrawerContent />)).toThrow("useDrawer must be used within a Drawer.")
  render(
    <Drawer open modal={false}>
      <DrawerContent className={() => "popup"}>
        <DrawerTitle className={() => "title"}>Title</DrawerTitle>
        <DrawerDescription className={() => "copy"}>Copy</DrawerDescription>
      </DrawerContent>
    </Drawer>
  )
  expect(document.querySelector(".popup")).not.toBeNull()
  expect(document.querySelector('[data-slot="drawer-overlay"]')).toBeNull()
})
test("drawer preserves swipe direction, snap option and close callback", async () => {
  for (const swipeDirection of ["down", "up", "left", "right"] as const) {
    const change = vi.fn()
    const { unmount } = render(
      <Drawer open swipeDirection={swipeDirection} showSwipeHandle snapPoints={[0.5, 1]} onOpenChange={change}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Title</DrawerTitle>
            <DrawerDescription>Copy</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
    expect((await screen.findByRole("dialog")).getAttribute("data-swipe-axis")).toBe(
      swipeDirection === "down" || swipeDirection === "up" ? "y" : "x"
    )
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(change.mock.calls[0]?.[0]).toBe(false)
    unmount()
  }
})
