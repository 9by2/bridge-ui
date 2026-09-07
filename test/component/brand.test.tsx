import { barY, defineChart } from "@tanstack/charts"
import { motion } from "@tanstack/charts/motion"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"

import { DropArea } from "../../app/component/brand/drop-area"
import { MultiSelectValue } from "../../app/component/brand/multi-select-value"
import { TsChart } from "../../app/component/brand/ts-chart"
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectItem
} from "../../app/component/shadcn/multi-select"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test("chart supports SVG, renderer and explicit height", () => {
  const definition = defineChart({
    marks: [barY([{ name: "A", value: 40 }], { x: "name", y: "value" })],
    scales: { x: { scale: scaleBand }, y: { scale: scaleLinear } }
  })
  for (const height of [undefined, 240]) {
    expect(renderToStaticMarkup(<TsChart definition={definition} height={height} ariaLabel="Volume" />)).toContain(
      `height:${height ?? 256}px`
    )
    expect(
      renderToStaticMarkup(<TsChart renderer={motion()} definition={definition} height={height} ariaLabel="Motion" />)
    ).toContain("Motion")
  }
})

test("selection value forwards placeholder", () => {
  render(
    <MultiSelect>
      <MultiSelectTrigger>
        <MultiSelectValue placeholder="Choose" className="custom-value" />
      </MultiSelectTrigger>
    </MultiSelect>
  )
  expect(screen.getByText("Choose")).toBeDefined()
})

test("selection badge forwards class and removes selected value", async () => {
  const disconnect = vi.fn()
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect = disconnect
    }
  )
  const change = vi.fn()
  Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: vi.fn() })
  const view = render(
    <MultiSelect defaultValues={["one"]} onValuesChange={change}>
      <MultiSelectTrigger>
        <MultiSelectValue className="custom-value" />
      </MultiSelectTrigger>
      <MultiSelectContent search={false}>
        <MultiSelectItem value="one">One</MultiSelectItem>
      </MultiSelectContent>
    </MultiSelect>
  )
  await waitFor(() => expect(view.container.querySelector("[data-selected-item]")).not.toBeNull())
  const badge = view.container.querySelector("[data-selected-item]")!
  expect(badge.closest(".custom-value")?.className).toContain("bg-primary")
  fireEvent.click(badge)
  expect(change).toHaveBeenCalledWith([])
  view.unmount()
  expect(disconnect).toHaveBeenCalled()
})

test("drop area forwards extraction error and drag state", async () => {
  const error = new Error("File extraction failed")
  const onError = vi.fn()
  const view = render(
    <DropArea
      label="Upload"
      getFilesFromEvent={async () => {
        throw error
      }}
      onError={onError}>
      Select
    </DropArea>
  )
  fireEvent.change(view.container.querySelector("input")!, { target: { files: [new File(["ok"], "sample.txt")] } })
  await waitFor(() => expect(onError).toHaveBeenCalledWith(error))
  view.rerender(
    <DropArea label="Upload" accept={{ "text/plain": [".txt"] }}>
      Select
    </DropArea>
  )
  const file = new File(["ok"], "sample.txt", { type: "text/plain" })
  const dataTransfer = {
    files: [file],
    items: [{ kind: "file", type: file.type, getAsFile: () => file }],
    types: ["Files"]
  }
  fireEvent.dragEnter(screen.getByRole("button"), { dataTransfer })
  await waitFor(() => expect(screen.getByRole("button").getAttribute("data-active")).toBe("true"))
  fireEvent.dragLeave(screen.getByRole("button"), { dataTransfer })
  await waitFor(() => expect(screen.getByRole("button").getAttribute("data-active")).toBe("false"))
})

test("drop area accepts, rejects, disables and cleans up document listener", async () => {
  const accepted = vi.fn()
  const rejected = vi.fn()
  const remove = vi.spyOn(document, "removeEventListener")
  const view = render(
    <DropArea label="Upload" accept={{ "text/plain": [".txt"] }} onDropAccepted={accepted} onDropRejected={rejected}>
      Select file
    </DropArea>
  )
  const input = view.container.querySelector("input")!
  fireEvent.change(input, { target: { files: [new File(["ok"], "sample.txt", { type: "text/plain" })] } })
  await waitFor(() => expect(accepted).toHaveBeenCalledOnce())
  fireEvent.change(input, { target: { files: [new File(["no"], "image.png", { type: "image/png" })] } })
  await waitFor(() => expect(rejected).toHaveBeenCalledOnce())
  view.rerender(
    <DropArea label="Upload" disabled onDropAccepted={accepted}>
      Disabled
    </DropArea>
  )
  expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe("true")
  expect(input.disabled).toBe(true)
  fireEvent.drop(screen.getByRole("button"), {
    dataTransfer: { files: [new File(["ok"], "another.txt", { type: "text/plain" })], types: ["Files"] }
  })
  expect(accepted).toHaveBeenCalledOnce()
  view.unmount()
  expect(remove.mock.calls.some(([name]) => name === "drop")).toBe(true)
  remove.mockRestore()
})
