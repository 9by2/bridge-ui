import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Theme } from "../../internal/pilot/theme"
import { Toaster, createToastManager } from "../../internal/pilot/toast"
import * as UI from "../../internal/pilot/toast"

afterEach(cleanup)
test("toast icon and slot callback contract", async () => {
  for (const type of [undefined, "info", "warning", "error", "loading"]) {
    const manager = createToastManager()
    const { unmount } = render(<Toaster toastManager={manager} />)
    act(() => {
      manager.add({ title: "Notice", type, timeout: 0, actionProps: { children: "Action" } })
    })
    expect(await screen.findByText("Notice")).toBeTruthy()
    unmount()
  }
  function List() {
    const { toasts } = UI.useToastManager()
    return toasts.map((item) => (
      <UI.Toast key={item.id} toast={item} className={() => "root"}>
        <UI.ToastContent className={() => "content"}>
          <UI.ToastTitle className={() => "title"} />
          <UI.ToastDescription className={() => "description"} />
          <UI.ToastAction className={() => "action"}>Act</UI.ToastAction>
          <UI.ToastClose className={() => "close"}>Close</UI.ToastClose>
        </UI.ToastContent>
      </UI.Toast>
    ))
  }
  const manager = createToastManager()
  render(
    <UI.ToastProvider toastManager={manager}>
      <UI.ToastPortal>
        <UI.ToastViewport className={() => "viewport"}>
          <List />
        </UI.ToastViewport>
      </UI.ToastPortal>
    </UI.ToastProvider>
  )
  act(() => {
    manager.add({ title: "Custom", description: "Copy", timeout: 0 })
  })
  expect(await screen.findByText("Custom")).toBeTruthy()
})
test("toast manager retains add close and portal theme", async () => {
  const manager = createToastManager()
  render(
    <Theme mode="dark">
      <Toaster toastManager={manager} />
    </Theme>
  )
  act(() => {
    manager.add({ title: "Saved", description: "Complete", type: "success", timeout: 0 })
  })
  const title = await screen.findByText("Saved")
  expect(title.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("dark")
  fireEvent.click(screen.getByLabelText("Close toast"))
})
