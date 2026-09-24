import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import * as sonnerEntry from "../../app/component/brand/stylex/sonner"
import * as root from "../../app/index"

afterEach(async () => {
  await act(async () => root.sonnerToast.dismiss())
  cleanup()
})

// Protects: consumer calls `sonnerToast.success()` and the message appears inside the mounted
// Bridge `SonnerToaster` (bridge-web shell previously mounted the Base UI Toaster, so nothing rendered).
test("sonnerToast renders inside a mounted SonnerToaster", async () => {
  render(<root.SonnerToaster />)
  await act(async () => {
    root.sonnerToast.success("Saved profile")
    await new Promise((resolve) => setTimeout(resolve, 50))
  })
  expect(await screen.findByText("Saved profile")).toBeTruthy()
})

// Protects: the `@bridge/ui/sonner` subpath and the root share one Sonner instance, so a toast
// fired from one import renders in a toaster mounted from the other.
test("sonner subpath shares identity with root exports", () => {
  expect(sonnerEntry.toast).toBe(root.sonnerToast)
  expect(sonnerEntry.Toaster).toBe(root.SonnerToaster)
})

// Protects: the existing Base UI `toast` manager is not renamed or replaced.
test("Base UI toast export is unchanged and distinct from sonnerToast", () => {
  expect(typeof root.toast.add).toBe("function")
  expect(root.toast).not.toBe(root.sonnerToast)
})
