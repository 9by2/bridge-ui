import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { afterEach, expect, test } from "vitest"

import { Button } from "../../app/component/brand/stylex/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogOverlay,
  DialogIcon
} from "../../app/component/brand/stylex/dialog"
import { numberTextClassName, Theme } from "../../app/component/brand/stylex/theme"

afterEach(cleanup)

test("theme exports number font presentation", () => {
  expect(numberTextClassName).toBeTypeOf("string")
  expect(numberTextClassName.length).toBeGreaterThan(0)
})

test("pilot dialog retains class callback on primitive slot", async () => {
  render(
    <Dialog defaultOpen>
      <DialogOverlay className={() => "overlay-caller"} />
      <DialogContent className={() => "popup-caller"}>
        <DialogTitle className={() => "title-caller"}>Callback</DialogTitle>
        <DialogDescription className={() => "description-caller"}>Description</DialogDescription>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
  expect((await screen.findByRole("dialog")).className).toContain("popup-caller")
  expect(screen.getByText("Callback").className).toContain("title-caller")
  expect(screen.getByText("Description").className).toContain("description-caller")
  expect(document.querySelector(".overlay-caller")).not.toBeNull()
})
test("pilot dialog preserves controlled state, portaled theme and Escape focus return", async () => {
  function Fixture() {
    const [open, setOpen] = useState(false)
    return (
      <Theme mode="light">
        <Theme mode="dark">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>Open</DialogTrigger>
            <DialogContent>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Change preference</DialogDescription>
            </DialogContent>
          </Dialog>
        </Theme>
      </Theme>
    )
  }
  render(<Fixture />)
  const trigger = screen.getByRole("button", { name: "Open" })
  trigger.focus()
  fireEvent.click(trigger)
  const popup = await screen.findByRole("dialog")
  expect(popup.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("dark")
  expect(screen.getByRole("button", { name: "dialog-close" })).toBeTruthy()
  fireEvent.keyDown(popup, { key: "Escape" })
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  await waitFor(() => expect(document.activeElement).toBe(trigger))
})

test("pilot dialog preserves Cue theme through portal", async () => {
  render(
    <Theme mode="cue">
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Cue settings</DialogTitle>
          <DialogDescription>Exact product theme</DialogDescription>
        </DialogContent>
      </Dialog>
    </Theme>
  )
  const popup = await screen.findByRole("dialog")
  expect(popup.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("cue")
})

test("theme accepts every explicit public mode", () => {
  for (const mode of ["light", "dark", "cue"] as const) {
    const { unmount } = render(
      <Theme mode={mode} className="caller-theme">
        Theme
      </Theme>
    )
    expect(screen.getByText("Theme").getAttribute("data-pilot-theme")).toBe(mode)
    expect(screen.getByText("Theme").className).toContain("caller-theme")
    unmount()
  }
  const { unmount } = render(<Theme>Inherited default</Theme>)
  expect(screen.getByText("Inherited default").getAttribute("data-pilot-theme")).toBe("light")
  unmount()
})

test("pilot dialog retains hidden close option, footer action and unmount cleanup", async () => {
  const { unmount } = render(
    <Theme mode="dark">
      <Theme mode="light">
        <Dialog defaultOpen>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Confirm</DialogTitle>
              <DialogDescription>Review</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      </Theme>
    </Theme>
  )
  const popup = await screen.findByRole("dialog")
  expect(popup.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("light")
  expect(screen.getAllByRole("button", { name: "dialog-close" })).toHaveLength(1)
  unmount()
  expect(document.querySelector("[role=dialog]")).toBeNull()
})

test("dialog uses caller close affordance label and neutral icon composition", async () => {
  render(
    <Dialog defaultOpen>
      <DialogContent closeLabel="Dismiss dialog">
        <DialogIcon>!</DialogIcon>
        <DialogTitle>Notice</DialogTitle>
      </DialogContent>
    </Dialog>
  )
  const close = screen.getByRole("button", { name: "Dismiss dialog" })
  expect(close.dataset.slot).toBe("dialog-close")
  expect(close.getAttribute("aria-label")).toBe("Dismiss dialog")
  expect(document.querySelector("[data-slot=dialog-icon]")?.textContent).toBe("!")
})
