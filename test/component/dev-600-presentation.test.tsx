import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import {
  DetailItem,
  DetailItemContent,
  DetailItemLabel,
  ProductItem,
  ProductItemAction,
  ProductItemContent,
  ProductItemMedia,
  QuantityStepper,
  Receipt,
  ReceiptDetail,
  ReceiptRow,
  ResponsiveImage,
  SettingItem,
  SettingItemAction,
  SettingItemDescription,
  SettingItemTitle,
  StatusStamp,
  StickyAlert,
  SuccessBurst,
  TicketCard,
  TicketCardFront,
  TicketCardBack,
  TicketCover
} from "../../app"

afterEach(cleanup)

test("branded composition exposes semantic slots and caller content", () => {
  const { container } = render(
    <>
      <div>
        <Receipt>
          <ReceiptRow>
            <dt>Total</dt>
            <dd>100</dd>
          </ReceiptRow>
        </Receipt>
        <ReceiptDetail>Terms</ReceiptDetail>
      </div>
      <StatusStamp tone="success">Paid</StatusStamp>
      <DetailItem>
        <DetailItemLabel>Label</DetailItemLabel>
        <DetailItemContent>Value</DetailItemContent>
      </DetailItem>
      <SettingItem>
        <SettingItemTitle>Setting</SettingItemTitle>
        <SettingItemDescription>Info</SettingItemDescription>
        <SettingItemAction>Action</SettingItemAction>
      </SettingItem>
      <StickyAlert tone="warning" offset="4rem">
        Alert
      </StickyAlert>
      <SuccessBurst />
    </>
  )
  expect(container.querySelector("dl[data-slot=receipt]")).not.toBeNull()
  expect(container.querySelector("[data-slot=receipt-row]")).not.toBeNull()
  expect(screen.getByText("Paid").getAttribute("data-tone")).toBe("success")
  expect(screen.getByText("Setting").tagName).toBe("H3")
  expect(container.querySelector("[data-slot=success-burst]")?.getAttribute("aria-hidden")).toBe("true")
})

test("controlled quantity and ticket side report caller state", () => {
  const change: number[] = []
  const side: string[] = []
  const view = render(
    <>
      <QuantityStepper
        value={2}
        min={1}
        max={3}
        decrementLabel="Less"
        incrementLabel="More"
        onValueChange={(value) => change.push(value)}
      />
      <TicketCard side="front" frontLabel="Front" backLabel="Back" onSideChange={(value) => side.push(value)}>
        <TicketCardFront>Front</TicketCardFront>
        <TicketCardBack>Back</TicketCardBack>
      </TicketCard>
    </>
  )
  fireEvent.click(screen.getByLabelText("More"))
  fireEvent.click(screen.getByLabelText("Less"))
  expect(change).toEqual([3, 1])
  fireEvent.click(screen.getByRole("button", { name: "Back" }))
  expect(side).toEqual(["back"])
  expect(view.container.querySelector("[data-slot=ticket-card]")?.getAttribute("data-side")).toBe("front")
})

test("responsive image has presentation-only source and decorative semantics", () => {
  const { container } = render(
    <>
      <ResponsiveImage
        alt="Cover"
        src="/cover.jpg"
        sourceSet={[
          { srcSet: "/cover-small.jpg", media: "(max-width: 640px)" },
          { srcSet: "/cover-wide.avif", type: "image/avif" }
        ]}
        priority
      />
      <ResponsiveImage decorative src="/mark.svg" />
    </>
  )
  const sources = container.querySelectorAll("picture source")
  expect(sources[0]?.getAttribute("media")).toBe("(max-width: 640px)")
  expect(sources[1]?.hasAttribute("media")).toBe(false)
  expect(screen.getByAltText("Cover").getAttribute("fetchpriority")).toBe("high")
  expect(container.querySelectorAll("img")[1]?.getAttribute("alt")).toBe("")
})

test("responsive image forwards its native ref", () => {
  const ref = createRef<HTMLImageElement>()
  render(<ResponsiveImage ref={ref} alt="Cover" src="/cover.jpg" />)
  expect(ref.current?.dataset.slot).toBe("responsive-image")
})

test("ticket cover and product item retain caller slots", () => {
  render(
    <>
      <TicketCover media={<span>Media</span>} metadata={<span>Metadata</span>}>
        <span>Cover content</span>
      </TicketCover>
      <ProductItem>
        <ProductItemMedia>
          <span>Product media</span>
        </ProductItemMedia>
        <ProductItemContent>
          <span>Product</span>
        </ProductItemContent>
        <ProductItemAction>
          <span>Product action</span>
        </ProductItemAction>
      </ProductItem>
    </>
  )
  expect(screen.getByText("Media").closest("[data-slot=ticket-cover-media]")).not.toBeNull()
  expect(screen.getByText("Product media").closest("[data-slot=product-item-media]")).not.toBeNull()
  expect(screen.getByText("Product").closest("[data-slot=product-item-content]")).not.toBeNull()
  expect(screen.getByText("Product action").closest("[data-slot=product-item-action]")).not.toBeNull()
})

test("ticket cover renders without optional media or metadata slots", () => {
  const { container } = render(<TicketCover>Bare content</TicketCover>)
  expect(container.querySelector("[data-slot=ticket-cover-media]")).toBeNull()
  expect(container.querySelector("[data-slot=ticket-cover-metadata]")).toBeNull()
  expect(container.querySelector("[data-slot=ticket-cover-body]")).not.toBeNull()
})

test("quantity stepper without a max caps only at the minimum", () => {
  const change: number[] = []
  render(
    <QuantityStepper
      value={0}
      decrementLabel="Less"
      incrementLabel="More"
      onValueChange={(value) => change.push(value)}
    />
  )
  expect(screen.getByLabelText("Less")).toHaveProperty("disabled", true)
  expect(screen.getByLabelText("More")).toHaveProperty("disabled", false)
  fireEvent.click(screen.getByLabelText("More"))
  expect(change).toEqual([1])
})

test("ticket card ignores toggle when a caller omits onSideChange", () => {
  const { container } = render(
    <TicketCard frontLabel="Front" backLabel="Back">
      <TicketCardFront>Front</TicketCardFront>
      <TicketCardBack>Back</TicketCardBack>
    </TicketCard>
  )
  expect(container.querySelector("[data-slot=ticket-card]")?.getAttribute("data-side")).toBe("front")
  fireEvent.click(screen.getByRole("button", { name: "Back" }))
  expect(container.querySelector("[data-slot=ticket-card]")?.getAttribute("data-side")).toBe("back")
})

test("responsive image renders without a source set and defaults alt to undefined", () => {
  const { container } = render(<ResponsiveImage src="/plain.jpg" />)
  expect(container.querySelector("picture")).toBeNull()
  const image = container.querySelector("img")
  expect(image?.getAttribute("src")).toBe("/plain.jpg")
  expect(image?.hasAttribute("alt")).toBe(false)
})

test("sticky alert falls back to an inline top when no offset is given", () => {
  const { container } = render(<StickyAlert>No offset</StickyAlert>)
  const node = container.querySelector("[data-slot=sticky-alert]") as HTMLElement | null
  expect(node?.style.top).toBe("")
})
