import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Spinner, SpinnerSize } from "../../app/component/brand/stylex/spinner"

afterEach(cleanup)

// Protects: every size remains an announced loading status so consumers can drop their size wrapper
// without losing assistive-technology feedback.
test.each(Object.values(SpinnerSize))("spinner size %s keeps loading status semantics", (size) => {
  render(<Spinner size={size} />)
  const status = screen.getByRole("status", { name: "Loading" })
  expect(status.getAttribute("data-size")).toBe(size)
})

// Regression (WebView 0924): container icon CSS (`.pilot-button svg:not([class*="size-"])`) overrode an
// explicit spinner size inside Button. An explicit size must opt out through the `size-*` contract;
// omitting size keeps container-driven sizing.
test("explicit spinner size opts out of container icon sizing", () => {
  render(
    <>
      <Spinner size={SpinnerSize.sm} aria-label="Explicit" />
      <Spinner aria-label="Implicit" />
    </>
  )
  expect(screen.getByRole("status", { name: "Explicit" }).matches('[class*="size-"]')).toBe(true)
  expect(screen.getByRole("status", { name: "Implicit" }).matches('[class*="size-"]')).toBe(false)
})

// Protects: default consumer render is unchanged and a caller label still overrides the default.
test("spinner defaults to the default size and accepts a caller label", () => {
  render(<Spinner aria-label="Saving" />)
  expect(screen.getByRole("status", { name: "Saving" }).getAttribute("data-size")).toBe(SpinnerSize.default)
})
