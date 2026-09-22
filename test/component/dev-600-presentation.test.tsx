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
  QrCode,
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
  TicketCover,
  SwimLaneBoard,
  SwimLaneBoardCell,
  SwimLaneBoardColumn,
  SwimLaneBoardItem,
  SwimLaneBoardLane
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
      <TicketCover>
        <span>Cover media</span>
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
  expect(screen.getByText("Cover media").closest("[data-slot=ticket-cover]")).not.toBeNull()
  expect(screen.getByText("Product media").closest("[data-slot=product-item-media]")).not.toBeNull()
  expect(screen.getByText("Product").closest("[data-slot=product-item-content]")).not.toBeNull()
  expect(screen.getByText("Product action").closest("[data-slot=product-item-action]")).not.toBeNull()
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

test("swim lane board auto-collapses empty columns while lanes remain static", () => {
  render(
    <SwimLaneBoard label="Board">
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardColumn id="done" label="Done" count={0} />
      <SwimLaneBoardLane id="active" label="Active" count={1}>
        <SwimLaneBoardCell columnId="todo">
          <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
        </SwimLaneBoardCell>
      </SwimLaneBoardLane>
      <SwimLaneBoardLane id="empty" label="Empty" count={0} />
    </SwimLaneBoard>
  )
  expect(screen.getByRole("button", { name: "Expand Done" }).getAttribute("aria-expanded")).toBe("false")
  expect(screen.queryByRole("button", { name: /Empty/ })).toBeNull()
})

test("swim lane board emits a pointer move intent without mutating caller data", () => {
  const move: unknown[] = []
  render(
    <SwimLaneBoard label="Board" autoCollapse="never" onItemMove={(intent) => move.push(intent)}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardColumn id="done" label="Done" count={0} />
      <SwimLaneBoardLane id="active" label="Active" count={1}>
        <SwimLaneBoardCell columnId="todo">
          <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
        </SwimLaneBoardCell>
        <SwimLaneBoardCell columnId="done" />
      </SwimLaneBoardLane>
    </SwimLaneBoard>
  )
  const item = screen.getByText("Item one")
  const target = screen.getByLabelText("Active / Done")
  fireEvent.dragStart(item)
  fireEvent.dragOver(target)
  fireEvent.drop(target)
  expect(move).toEqual([
    {
      itemId: "item-1",
      source: { laneId: "active", columnId: "todo", index: 0 },
      destination: { laneId: "active", columnId: "done", index: 0 },
      sourceEvent: "pointer"
    }
  ])
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

test("qr code renders an accessible svg encoding the caller value with brand-safe defaults", () => {
  const { container } = render(<QrCode value="https://example.com/ticket/abc" title="Ticket QR" />)
  const svg = container.querySelector("[data-slot=qr-code]")
  expect(svg?.tagName).toBe("svg")
  expect(svg?.querySelector("title")?.textContent).toBe("Ticket QR")
  expect(svg?.getAttribute("width")).toBe("128")
  expect(svg?.getAttribute("height")).toBe("128")
  const paths = svg?.querySelectorAll("path")
  expect(paths?.[0]?.getAttribute("fill")).toBe("transparent")
  expect(paths?.[1]?.getAttribute("fill")).toBe("currentColor")
})

test("qr code forwards size, level, and color overrides", () => {
  const { container } = render(
    <QrCode value="123" size={64} level="L" bgColor="white" fgColor="black" className="caller-class" />
  )
  const svg = container.querySelector("[data-slot=qr-code]")
  expect(svg?.getAttribute("width")).toBe("64")
  expect(svg?.getAttribute("height")).toBe("64")
  expect(svg?.getAttribute("class")).toContain("caller-class")
})
