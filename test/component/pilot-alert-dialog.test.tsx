import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPortal,
  AlertDialogOverlay
} from "../../app/component/brand/stylex/alert-dialog"
import { Theme } from "../../app/component/brand/stylex/theme"

afterEach(cleanup)
test("alert dialog small and callback styling", () => {
  render(
    <AlertDialog open>
      <AlertDialogPortal>
        <AlertDialogOverlay className={() => "overlay"} />
      </AlertDialogPortal>
      <AlertDialogContent size="sm" className={() => "content"}>
        <AlertDialogTitle className={() => "title"}>Title</AlertDialogTitle>
        <AlertDialogDescription className={() => "description"}>Copy</AlertDialogDescription>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  )
  expect(screen.getByRole("alertdialog").className).toContain("content")
})
test("alert dialog action stays caller owned and cancel closes", async () => {
  const action = vi.fn()
  const change = vi.fn()
  render(
    <Theme mode="dark">
      <AlertDialog open onOpenChange={change}>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>!</AlertDialogMedia>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>Copy</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={action}>Apply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Theme>
  )
  expect((await screen.findByRole("alertdialog")).closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe(
    "dark"
  )
  fireEvent.click(screen.getByRole("button", { name: "Apply" }))
  expect(action).toHaveBeenCalledOnce()
  expect(change).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
  expect(change.mock.calls[0]?.[0]).toBe(false)
})
