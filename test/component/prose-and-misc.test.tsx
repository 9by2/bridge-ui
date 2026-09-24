import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { useState, type ReactNode } from "react"
import { afterEach, expect, expectTypeOf, test, vi } from "vitest"

import { ResponsiveImage } from "../../app/component/brand/stylex/responsive-image"
import {
  ShellHeader,
  ShellHeaderActionProvider,
  ShellHeaderActionSlot,
  useShellHeaderAction
} from "../../app/component/brand/stylex/shell-header"
import * as typography from "../../app/component/brand/stylex/typography"
import * as root from "../../app/index"
import type { DateRange, Matcher, PercentCrop, PixelCrop } from "../../app/index"

afterEach(cleanup)

// Protects P2-1: prose primitives render native semantics from root and the typography subpath.
test("prose typography renders semantic elements and ordered list", () => {
  const { Blockquote, InlineCode, Large, Lead, List, Muted, Small } = root
  render(
    <>
      <Lead>ข้อความนำ lead paragraph</Lead>
      <Blockquote cite="https://example.com">Quoted</Blockquote>
      <p>
        Run <InlineCode>bun test</InlineCode>
      </p>
      <List aria-label="Bullet">
        <li>One</li>
      </List>
      <List ordered aria-label="Step">
        <li>First</li>
      </List>
      <Muted>Muted note</Muted>
      <Small>Small print</Small>
      <Large>Large text</Large>
    </>
  )
  expect(screen.getByText("Quoted").tagName).toBe("BLOCKQUOTE")
  expect(screen.getByText("bun test").tagName).toBe("CODE")
  expect(screen.getByRole("list", { name: "Bullet" }).tagName).toBe("UL")
  expect(screen.getByRole("list", { name: "Step" }).tagName).toBe("OL")
  expect(screen.getByText("Small print").tagName).toBe("SMALL")
  expect(screen.getByText("ข้อความนำ lead paragraph").getAttribute("data-slot")).toBe("lead")
  for (const name of ["Blockquote", "InlineCode", "List", "Lead", "Muted", "Small", "Large"] as const)
    expect(typography[name]).toBe(root[name])
})

// Protects P2-2: a broken image swaps to the fallback exactly once (no error loop) and resets on new src.
test("responsive image swaps to fallback once and resets on new src", () => {
  const onError = vi.fn()
  const { rerender } = render(
    <ResponsiveImage
      src="/broken.png"
      fallbackSrc="/fallback.png"
      alt="Venue"
      onError={onError}
      sourceSet={[{ srcSet: "/broken.webp", type: "image/webp" }]}
    />
  )
  const image = () => screen.getByRole("img", { name: "Venue" })
  fireEvent.error(image())
  expect(image().getAttribute("src")).toBe("/fallback.png")
  expect(document.querySelector("source")).toBeNull()
  fireEvent.error(image())
  expect(image().getAttribute("src")).toBe("/fallback.png")
  expect(onError).toHaveBeenCalledTimes(2)
  rerender(<ResponsiveImage src="/next.png" fallbackSrc="/fallback.png" alt="Venue" onError={onError} />)
  expect(image().getAttribute("src")).toBe("/next.png")
})

// Protects P2-2: blur placeholder shows until load; decorative rule still hides the image.
test("responsive image blur placeholder clears on load and keeps decorative rule", () => {
  const onLoad = vi.fn()
  render(
    <ResponsiveImage
      src="/photo.png"
      alt=""
      decorative
      placeholder={{ blurDataUrl: "data:image/png;base64,AA" }}
      onLoad={onLoad}
    />
  )
  const image = document.querySelector<HTMLImageElement>('[data-slot="responsive-image"]')!
  expect(image.getAttribute("aria-hidden")).toBe("true")
  expect(image.style.backgroundImage).toContain("data:image/png;base64,AA")
  expect(image.hasAttribute("data-loaded")).toBe(false)
  fireEvent.load(image)
  expect(image.style.backgroundImage).toBe("")
  expect(image.getAttribute("data-loaded")).toBe("true")
  expect(onLoad).toHaveBeenCalledOnce()
})

function RouteAction({ label }: { label: string }) {
  useShellHeaderAction(<button type="button">{label}</button>)
  return null
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <ShellHeaderActionProvider>
      <ShellHeader>
        <ShellHeaderActionSlot />
      </ShellHeader>
      {children}
    </ShellHeaderActionProvider>
  )
}

// Protects P2-3: a descendant route injects a header action, updates it, and clears it on unmount.
test("shell header action is set by a descendant, updates, and clears on unmount", () => {
  function Harness() {
    const [state, setState] = useState<"none" | "a" | "b">("a")
    return (
      <Shell>
        {state === "none" ? null : <RouteAction label={state === "a" ? "Create event" : "Export"} />}
        <button type="button" onClick={() => setState("b")}>
          switch
        </button>
        <button type="button" onClick={() => setState("none")}>
          leave
        </button>
      </Shell>
    )
  }
  const { container } = render(<Harness />)
  expect(
    screen.getByRole("button", { name: "Create event" }).closest('[data-slot="shell-header-action"]')
  ).not.toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "switch" }))
  expect(screen.queryByRole("button", { name: "Create event" })).toBeNull()
  expect(screen.getByRole("button", { name: "Export" })).toBeTruthy()
  act(() => fireEvent.click(screen.getByRole("button", { name: "leave" })))
  expect(screen.queryByRole("button", { name: "Export" })).toBeNull()
  expect(container.querySelector('[data-slot="shell-header-action"]')).toBeNull()
})

// Protects P2-3: hook outside a provider is a safe no-op.
test("shell header action hook is a no-op outside a provider", () => {
  expect(() => render(<RouteAction label="Orphan" />)).not.toThrow()
  expect(screen.queryByRole("button", { name: "Orphan" })).toBeNull()
})

// Protects P2-3: slot renders nothing (no empty action container) when no route publishes.
test("shell header action slot renders nothing without an action", () => {
  const { container } = render(
    <ShellHeaderActionProvider>
      <ShellHeaderActionSlot />
    </ShellHeaderActionProvider>
  )
  expect(container.querySelector('[data-slot="shell-header-action"]')).toBeNull()
})

// Protects P2-4: separator renders between groups in an open multi-select list.
test("multi-select separator renders between groups", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
  const {
    MultiSelect,
    MultiSelectContent,
    MultiSelectGroup,
    MultiSelectItem,
    MultiSelectSeparator,
    MultiSelectTrigger
  } = root
  render(
    <MultiSelect>
      <MultiSelectTrigger aria-label="Choose" />
      <MultiSelectContent search={false}>
        <MultiSelectGroup>
          <MultiSelectItem value="a">Alpha</MultiSelectItem>
        </MultiSelectGroup>
        <MultiSelectSeparator />
        <MultiSelectGroup>
          <MultiSelectItem value="b">Beta</MultiSelectItem>
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  )
  fireEvent.click(screen.getByRole("combobox", { name: "Choose" }))
  await screen.findAllByText("Beta")
  expect(document.querySelector('[data-slot="command-separator"]')).not.toBeNull()
  vi.unstubAllGlobals()
})

// Protects P2-4: consumer can drop react-day-picker / react-image-crop type imports and use the separator.
test("small exports resolve from root", () => {
  expectTypeOf<DateRange>().toHaveProperty("from")
  expectTypeOf<Matcher>().not.toBeNever()
  expectTypeOf<PercentCrop["unit"]>().toEqualTypeOf<"%">()
  expectTypeOf<PixelCrop["unit"]>().toEqualTypeOf<"px">()
  expect(typeof root.MultiSelectSeparator).toBe("function")
})
