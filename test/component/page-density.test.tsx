import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test, vi } from "vitest"

import { DataState, DataStateTitle } from "../../app/component/brand/stylex/data-state"
import {
  Page,
  PageDensity,
  PageEyebrow,
  PageFilter,
  PageFormAction,
  PageFormActionAlign,
  PageHeader,
  PageHeading,
  PageMeta,
  PageTitle,
  PageWidth
} from "../../app/component/brand/stylex/page"

afterEach(cleanup)

const page = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>("[data-slot=page]")]

// Protects DEC-001: existing `spacing` consumers resolve exactly as before (38 bridge-web uses).
test.each(Object.values(PageDensity))("deprecated spacing=%s alone resolves unchanged", (value) => {
  const { container } = render(<Page spacing={value}>Body</Page>)
  const [node] = page(container)
  expect(node?.getAttribute("data-spacing")).toBe(value)
  expect(node?.getAttribute("data-density")).toBe(value)
})

// Protects DEC-001: canonical `density` wins when a migrating consumer passes both.
test("density overrides deprecated spacing", () => {
  const { container } = render(
    <Page spacing={PageDensity.comfortable} density={PageDensity.compact}>
      Body
    </Page>
  )
  const [node] = page(container)
  expect(node?.getAttribute("data-density")).toBe("compact")
  expect(node?.getAttribute("data-spacing")).toBe("compact")
})

// Protects DEC-001: default page is unchanged.
test("page without density or spacing resolves to default and no width", () => {
  const { container } = render(<Page>Body</Page>)
  const [node] = page(container)
  expect(node?.getAttribute("data-density")).toBe("default")
  expect(node?.getAttribute("data-spacing")).toBe("default")
  expect(node?.hasAttribute("data-width")).toBe(false)
})

// Protects DEC-005: width preset is observable for consumer layout composition.
test.each(Object.values(PageWidth))("width=%s is exposed", (width) => {
  const { container } = render(<Page width={width}>Body</Page>)
  expect(page(container)[0]?.getAttribute("data-width")).toBe(width)
})

// Protects: header slots compose inside PageHeader and forward native props and ref.
test("header slots compose and forward native props", () => {
  const ref = createRef<HTMLDivElement>()
  render(
    <Page>
      <PageHeader>
        <PageHeading>
          <PageEyebrow id="eyebrow">Studio</PageEyebrow>
          <PageTitle aria-describedby="eyebrow">Schedule</PageTitle>
          <PageMeta ref={ref} aria-label="Schedule detail">
            12 event
          </PageMeta>
        </PageHeading>
        <PageFilter role="search" aria-label="Schedule filter">
          <input aria-label="Search" />
        </PageFilter>
      </PageHeader>
    </Page>
  )
  expect(screen.getByRole("heading", { level: 1, name: "Schedule" }).getAttribute("aria-describedby")).toBe("eyebrow")
  expect(document.getElementById("eyebrow")?.getAttribute("data-slot")).toBe("page-eyebrow")
  expect(ref.current?.getAttribute("data-slot")).toBe("page-meta")
  expect(screen.getByRole("search", { name: "Schedule filter" }).getAttribute("data-slot")).toBe("page-filter")
})

// Protects: form action row exposes alignment and sticky state to consumers.
test("form action exposes align and sticky", () => {
  const { container } = render(
    <>
      <PageFormAction>
        <button>Save</button>
      </PageFormAction>
      <PageFormAction align={PageFormActionAlign.between} sticky>
        <button>Cancel</button>
      </PageFormAction>
    </>
  )
  const [plain, sticky] = [...container.querySelectorAll("[data-slot=page-form-action]")]
  expect(plain?.getAttribute("data-align")).toBe("end")
  expect(plain?.hasAttribute("data-sticky")).toBe(false)
  expect(sticky?.getAttribute("data-align")).toBe("between")
  expect(sticky?.getAttribute("data-sticky")).toBe("true")
  expect(screen.getByRole("button", { name: "Save" })).toBeTruthy()
})

// Protects: DataState retry convenience calls the consumer handler.
test("data state retry button calls onRetry", () => {
  const onRetry = vi.fn()
  render(
    <DataState variant="error" onRetry={onRetry} retryLabel="Try again">
      <DataStateTitle>Unable to load</DataStateTitle>
    </DataState>
  )
  fireEvent.click(screen.getByRole("button", { name: "Try again" }))
  expect(onRetry).toHaveBeenCalledTimes(1)
})

// Protects: DataState without onRetry renders no extra action; default label applies when omitted.
test("data state renders retry only when onRetry is provided", () => {
  const { rerender } = render(<DataState variant="error">Failed</DataState>)
  expect(screen.queryByRole("button")).toBeNull()
  rerender(
    <DataState variant="error" onRetry={() => undefined}>
      Failed
    </DataState>
  )
  expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy()
})
