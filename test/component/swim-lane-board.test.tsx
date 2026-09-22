import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { SwimLaneBoard, SwimLaneBoardCell, SwimLaneBoardColumn, SwimLaneBoardItem, SwimLaneBoardLane } from "../../app"

afterEach(cleanup)

function Board({
  collapsedColumnIds,
  onCollapsedColumnIdsChange = vi.fn(),
  withLane = false
}: {
  collapsedColumnIds?: readonly string[]
  onCollapsedColumnIdsChange?: (value: readonly string[]) => void
  withLane?: boolean
}) {
  const cell = (
    <SwimLaneBoardCell columnId="todo">
      <SwimLaneBoardItem id="task-1">Write spec</SwimLaneBoardItem>
    </SwimLaneBoardCell>
  )

  return (
    <SwimLaneBoard
      label="Delivery board"
      collapsedColumnIds={collapsedColumnIds}
      onCollapsedColumnIdsChange={onCollapsedColumnIdsChange}
      rowMaxHeight={320}>
      <SwimLaneBoardColumn id="todo" label="To do" count={1} />
      <SwimLaneBoardColumn id="done" label="Done" count={0} />
      {withLane ? (
        <SwimLaneBoardLane id="engineering" label="Engineering" count={1}>
          {cell}
        </SwimLaneBoardLane>
      ) : (
        cell
      )}
    </SwimLaneBoard>
  )
}

test("board reports controlled column collapse changes through accessible controls", () => {
  const onCollapsedColumnIdsChange = vi.fn()
  render(<Board collapsedColumnIds={[]} onCollapsedColumnIdsChange={onCollapsedColumnIdsChange} />)

  fireEvent.click(screen.getByRole("button", { name: "Collapse To do" }))

  expect(onCollapsedColumnIdsChange).toHaveBeenCalledWith(["todo"])
})

test("board presents collapsed columns and lane cells", () => {
  render(<Board collapsedColumnIds={["done"]} withLane />)

  expect(screen.getByRole("button", { name: "Expand Done" }).getAttribute("aria-expanded")).toBe("false")
  expect(screen.getByText("Engineering")).not.toBeNull()
  expect(screen.getByRole("group", { name: "Engineering / To do" }).getAttribute("tabindex")).toBe("0")
  expect(screen.getByText("Write spec").closest("[data-slot=swim-lane-board-item]")?.getAttribute("data-item-id")).toBe(
    "task-1"
  )
})
