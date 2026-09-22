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

test("status stamps support every public tone", () => {
  const tone = [
    "neutral",
    "info",
    "pending",
    "inactive",
    "partial-success",
    "success",
    "warning",
    "destructive"
  ] as const
  render(
    <>
      {tone.map((value) => (
        <StatusStamp key={value} tone={value}>
          {value}
        </StatusStamp>
      ))}
    </>
  )

  for (const value of tone) expect(screen.getByText(value).getAttribute("data-tone")).toBe(value)
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

test("swim lane board keeps zero-count columns expanded when auto-collapse is disabled", () => {
  render(
    <SwimLaneBoard label="Board" autoCollapse="never">
      <SwimLaneBoardColumn id="done" label="Done" count={0} />
      <SwimLaneBoardCell columnId="done" />
    </SwimLaneBoard>
  )
  expect(screen.getByRole("button", { name: "Collapse Done" }).getAttribute("aria-expanded")).toBe("true")
})

test("swim lane board reports controlled column collapse without mutating caller state", () => {
  const change: string[][] = []
  render(
    <SwimLaneBoard
      label="Board"
      autoCollapse="never"
      collapsedColumnIds={[]}
      onCollapsedColumnIdsChange={(value) => change.push([...value])}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardCell columnId="todo">
        <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
      </SwimLaneBoardCell>
    </SwimLaneBoard>
  )
  fireEvent.click(screen.getByRole("button", { name: "Collapse Todo" }))
  expect(change).toEqual([["todo"]])
  expect(screen.getByRole("button", { name: "Collapse Todo" })).not.toBeNull()
})

test("swim lane board expands an explicitly collapsed column and preserves caller content", () => {
  const change: string[][] = []
  render(
    <SwimLaneBoard
      label="Board"
      autoCollapse="never"
      defaultCollapsedColumnIds={["todo"]}
      onCollapsedColumnIdsChange={(value) => change.push([...value])}
      onItemMove={() => {}}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardCell columnId="todo">
        <span>Cell helper</span>
        <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
      </SwimLaneBoardCell>
    </SwimLaneBoard>
  )
  fireEvent.click(screen.getByRole("button", { name: "Expand Todo" }))
  expect(change).toEqual([[]])
  expect(screen.getByText("Cell helper")).not.toBeNull()
  expect(screen.getByText("Item one")).not.toBeNull()
})

test("swim lane board enables sortable items only when a move callback is provided", () => {
  const { rerender } = render(
    <SwimLaneBoard label="Board" autoCollapse="never">
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardCell columnId="todo">
        <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
      </SwimLaneBoardCell>
    </SwimLaneBoard>
  )
  expect(screen.getByText("Item one").closest("[data-slot=swim-lane-board-item]")?.getAttribute("tabindex")).toBeNull()

  rerender(
    <SwimLaneBoard label="Board" autoCollapse="never" onItemMove={() => {}}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardCell columnId="todo">
        <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
      </SwimLaneBoardCell>
    </SwimLaneBoard>
  )
  expect(screen.getByText("Item one").closest("[data-slot=swim-lane-board-item]")?.getAttribute("tabindex")).toBe("0")
})

test("swim lane board exposes coordinate drop targets during keyboard dragging", () => {
  render(
    <SwimLaneBoard label="Board" autoCollapse="never" onItemMove={() => {}}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={2} />
      <SwimLaneBoardColumn id="done" label="Done" count={1} />
      <SwimLaneBoardLane id="active" label="Active" count={3}>
        <SwimLaneBoardCell columnId="todo">
          <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
          <SwimLaneBoardItem id="item-2">Item two</SwimLaneBoardItem>
        </SwimLaneBoardCell>
        <SwimLaneBoardCell columnId="done">
          <SwimLaneBoardItem id="item-3">Item three</SwimLaneBoardItem>
        </SwimLaneBoardCell>
      </SwimLaneBoardLane>
    </SwimLaneBoard>
  )
  const item = screen.getByText("Item two").closest<HTMLElement>("[data-slot=swim-lane-board-item]")
  item?.focus()
  fireEvent.keyDown(item!, { code: "Space" })
  expect(item?.getAttribute("data-dragging")).toBe("true")
  const target = document.querySelectorAll("[data-slot=swim-lane-board-cell]")
  expect(target).toHaveLength(2)
  expect([...target].every((element) => element.getAttribute("data-drop-zone") === "true")).toBe(true)
})

test("swim lane board does not report a drop when the item did not move", () => {
  const move: unknown[] = []
  render(
    <SwimLaneBoard label="Board" autoCollapse="never" onItemMove={(intent) => move.push(intent)}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardCell columnId="todo">
        <SwimLaneBoardItem id="item-1">Item one</SwimLaneBoardItem>
      </SwimLaneBoardCell>
    </SwimLaneBoard>
  )
  const item = screen.getByText("Item one").closest<HTMLElement>("[data-slot=swim-lane-board-item]")
  item?.focus()
  fireEvent.keyDown(item!, { code: "Space" })
  fireEvent.keyDown(item!, { code: "Space" })
  expect(move).toEqual([])
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
