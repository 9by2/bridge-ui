import { act, cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { DataList, DataListStatus, DataListVariant } from "../../app/component/brand/stylex/data-list"

afterEach(cleanup)

const columns = [
  { id: "name", label: "Name", render: (row: { name: string }) => row.name },
  { id: "action", label: "Actions", render: () => <button>Open record</button> }
] as const

test("switches among loading, error, empty and ready states", () => {
  const { rerender } = render(<DataList status={DataListStatus.loading} columns={columns} rows={[]} />)
  expect(screen.getByRole("region").getAttribute("aria-busy")).toBe("true")

  rerender(<DataList status={DataListStatus.error} errorTitle="Could not load" columns={columns} rows={[]} />)
  expect(screen.getByRole("alert").textContent).toContain("Could not load")

  rerender(<DataList status={DataListStatus.empty} emptyTitle="Nothing here" columns={columns} rows={[]} />)
  expect(screen.getByText("Nothing here")).toBeDefined()
  expect(screen.queryByRole("table")).toBeNull()

  rerender(
    <DataList
      status={DataListStatus.ready}
      variants={DataListVariant.table}
      columns={columns}
      rows={[{ name: "Proposal" }]}
    />
  )
  expect(screen.getByRole("table")).toBeDefined()
  expect(screen.getByRole("columnheader", { name: "Name" })).toBeDefined()
  expect(screen.getByText("Proposal")).toBeDefined()
})

test("retry calls the supplied callback and custom empty action is rendered", () => {
  const onRetry = vi.fn()
  const { rerender } = render(
    <DataList status={DataListStatus.error} onRetry={onRetry} retryLabel="Try again" columns={columns} rows={[]} />
  )
  screen.getByRole("button", { name: "Try again" }).click()
  expect(onRetry).toHaveBeenCalledOnce()

  rerender(
    <DataList status={DataListStatus.empty} emptyAction={<button>Create record</button>} columns={columns} rows={[]} />
  )
  expect(screen.getByRole("button", { name: "Create record" })).toBeDefined()
})

test("exposes labelled fields and correct table semantics", () => {
  const { rerender } = render(
    <DataList
      status={DataListStatus.ready}
      variants={DataListVariant.table}
      columns={columns}
      rows={[{ name: "Desktop" }]}
    />
  )
  expect(screen.getByRole("table")).toBeDefined()
  expect(screen.getByRole("columnheader", { name: "Name" })).toBeDefined()
  expect(screen.getByRole("columnheader", { name: "Actions" })).toBeDefined()

  rerender(
    <DataList
      status={DataListStatus.ready}
      variants={DataListVariant.card}
      columns={columns}
      rows={[{ name: "Mobile" }]}
    />
  )
  expect(screen.getByRole("article", { name: "Row 1" })).toBeDefined()
  expect(screen.getByText("Name")).toBeDefined()
  expect(screen.getByText("Actions")).toBeDefined()
})

test("renders automatic presentation as a labelled row without duplicating interactive content", () => {
  window.matchMedia = () => ({
    matches: true,
    media: "(max-width: 640px)",
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })
  render(<DataList status={DataListStatus.ready} columns={columns} rows={[{ name: "Automatic row" }]} />)
  expect(screen.getAllByRole("article", { name: "Row 1" })).toHaveLength(1)
  expect(screen.getAllByRole("button", { name: "Open record" })).toHaveLength(1)
})

test("renders zero-row and row-keyed ready data in both presentations", () => {
  const { rerender } = render(
    <DataList status={DataListStatus.ready} variants={DataListVariant.table} columns={columns} rows={[]} />
  )
  expect(screen.getByRole("table")).toBeDefined()

  rerender(
    <DataList
      status={DataListStatus.ready}
      variants={DataListVariant.card}
      columns={columns}
      rows={[{ name: "Keyed row" }]}
      rowKey={(row) => row.name}
    />
  )
  expect(screen.getByRole("article", { name: "Keyed row" })).toBeDefined()
})

test("automatic presentation updates after a viewport breakpoint change", async () => {
  let matches = false
  let onChange: ((event: MediaQueryListEvent) => void) | undefined
  window.matchMedia = () => ({
    get matches() {
      return matches
    },
    media: "(max-width: 640px)",
    onchange: null,
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
      onChange = listener as (event: MediaQueryListEvent) => void
    },
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })
  const { rerender } = render(
    <DataList status={DataListStatus.ready} columns={columns} rows={[{ name: "Viewport row" }]} />
  )
  expect(screen.getByRole("table")).toBeDefined()
  matches = true
  act(() => onChange?.({ matches: true } as MediaQueryListEvent))
  rerender(<DataList status={DataListStatus.ready} columns={columns} rows={[{ name: "Viewport row" }]} />)
  expect(screen.getByRole("article", { name: "Row 1" })).toBeDefined()
})

test("supports standalone layout, empty copy omissions and zero skeleton rows", () => {
  const { rerender, container } = render(
    <DataList status={DataListStatus.loading} framed={false} skeletonRow={0} columns={columns} rows={[]} />
  )
  expect(container.querySelector('[data-slot="card"]')).toBeNull()
  expect(container.querySelector('[aria-busy="true"]')?.childElementCount).toBe(0)

  rerender(<DataList status={DataListStatus.error} columns={columns} rows={[]} onRetry={() => {}} />)
  expect(screen.getByRole("alert")).toBeDefined()
  rerender(<DataList status={DataListStatus.empty} columns={columns} rows={[]} />)
  expect(container.querySelector('[data-slot="empty-header"]')).toBeNull()
})

test("falls back to table presentation in an environment without media queries", () => {
  const originalMatchMedia = window.matchMedia
  Object.defineProperty(window, "matchMedia", { configurable: true, value: undefined })
  const view = render(<DataList status={DataListStatus.ready} columns={columns} rows={[]} />)
  expect(screen.getByRole("table")).toBeDefined()
  Object.defineProperty(window, "matchMedia", { configurable: true, value: originalMatchMedia })
})
