import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"

import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectGroup
} from "../../app/component/brand/stylex/multi-select"
import { MultiSelectValue as BrandValue } from "../../app/component/brand/stylex/multi-select-value"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
test("multi select overflow observer hides excess badge and disposes timer", async () => {
  const callbacks: ResizeObserverCallback[] = []
  const disconnect = vi.fn()
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: ResizeObserverCallback) {
        callbacks.push(callback)
      }
      observe() {}
      unobserve() {}
      disconnect = disconnect
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.querySelector("[data-selected-item]") ? 100 : 0
  })
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(0)
  const { unmount } = render(
    <MultiSelect defaultValues={["a"]}>
      <MultiSelectValue overflowBehavior="cutoff" />
      <MultiSelectContent>
        <MultiSelectItem value="a">Alpha</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>
  )
  await waitFor(() => expect(document.querySelector<HTMLElement>("[data-selected-item]")?.style.display).toBe("none"))
  vi.useFakeTimers()
  act(() => {
    for (const callback of callbacks) callback([], {} as ResizeObserver)
    vi.advanceTimersByTime(100)
  })
  unmount()
  expect(disconnect).toHaveBeenCalled()
})
test("multi select asChild and wrapping preserve composition", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
  for (const overflowBehavior of ["wrap", "cutoff", "wrap-when-open"] as const) {
    const { unmount } = render(
      <MultiSelect defaultValues={["a", "missing"]}>
        <MultiSelectTrigger asChild>
          <button aria-label="Choose" />
        </MultiSelectTrigger>
        <MultiSelectValue overflowBehavior={overflowBehavior} clickToRemove={false} />
        <MultiSelectContent search={false}>
          <MultiSelectGroup>
            <MultiSelectItem value="a" badgeLabel="Badge">
              Alpha
            </MultiSelectItem>
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
    )
    expect(await screen.findByText("Badge")).toBeTruthy()
    fireEvent.click(screen.getByRole("combobox", { name: "Choose" }))
    await screen.findByRole("dialog")
    unmount()
  }
})
test("multi select create and select-all retain caller callback", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
  const change = vi.fn()
  render(
    <MultiSelect allowedNewItem allowedSelectAll onValuesChange={change}>
      <MultiSelectTrigger aria-label="Choose">Choose</MultiSelectTrigger>
      <MultiSelectContent search={{ placeholder: "Search", emptyMessage: "Empty" }}>
        <MultiSelectItem value="a">Alpha</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>
  )
  fireEvent.click(screen.getByRole("combobox", { name: "Choose" }))
  const popup = within(await screen.findByRole("dialog"))
  fireEvent.keyDown(popup.getByRole("combobox"), { key: "ArrowDown" })
  fireEvent.click(popup.getByRole("option", { name: "Select all" }))
  expect(change.mock.calls.at(-1)?.[0]).toEqual(["a"])
  fireEvent.click(popup.getByRole("option", { name: "Clear all" }))
  expect(change.mock.calls.at(-1)?.[0]).toEqual([])
  fireEvent.change(popup.getByRole("combobox"), { target: { value: "New" } })
  fireEvent.keyDown(popup.getByRole("combobox"), { key: "Enter" })
  expect(change.mock.calls.at(-1)?.[0]).toEqual(["New"])
})
test("multi select controlled selection and badge removal", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
  const change = vi.fn()
  const { rerender } = render(
    <MultiSelect values={["a"]} onValuesChange={change}>
      <MultiSelectTrigger aria-label="Choose">
        <BrandValue />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectItem value="a">Alpha</MultiSelectItem>
        <MultiSelectItem value="b">Beta</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>
  )
  await waitFor(() => expect(document.querySelector("[data-selected-item]")?.textContent).toBe("Alpha"))
  fireEvent.click(document.querySelector("[data-selected-item]")!)
  expect(change).toHaveBeenCalledWith([])
  rerender(
    <MultiSelect values={[]} onValuesChange={change}>
      <MultiSelectTrigger aria-label="Choose" width="full">
        <MultiSelectValue placeholder="Choose" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectItem value="b">Beta</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>
  )
  fireEvent.click(screen.getByRole("combobox", { name: "Choose" }))
  const option = await within(await screen.findByRole("dialog")).findByRole("option", { name: "Beta" })
  fireEvent.click(option)
  expect(change.mock.calls.at(-1)?.[0]).toEqual(["b"])
})
test("multi select retains missing provider diagnostic and server composition", () => {
  expect(
    renderToString(
      <MultiSelect>
        <MultiSelectTrigger asChild role="button" width="full">
          <button aria-expanded={false}>Custom</button>
        </MultiSelectTrigger>
      </MultiSelect>
    )
  ).toContain("Custom")
  expect(
    renderToString(
      <MultiSelect>
        <MultiSelectTrigger asChild role="button">
          Text
        </MultiSelectTrigger>
      </MultiSelect>
    )
  ).toContain("Text")
  expect(() => render(<MultiSelectValue />)).toThrow("useMultiSelectContext must be used within a MultiSelectContext")
  const html = renderToString(
    <MultiSelect>
      <MultiSelectTrigger>
        <MultiSelectValue placeholder="Choose" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectItem value="a">Alpha</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>
  )
  expect(html).toContain("Choose")
  expect(html).toContain('role="combobox"')
})
