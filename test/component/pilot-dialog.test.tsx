import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { afterEach, expect, test } from "vitest"

import { Button } from "../../internal/pilot/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogOverlay
} from "../../internal/pilot/dialog"
import { Theme } from "../../internal/pilot/theme"

afterEach(cleanup)

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
  expect(screen.getByRole("button", { name: "Close" })).toBeTruthy()
  fireEvent.keyDown(popup, { key: "Escape" })
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  await waitFor(() => expect(document.activeElement).toBe(trigger))
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
  expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1)
  unmount()
  expect(document.querySelector("[role=dialog]")).toBeNull()
})
