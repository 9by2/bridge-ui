import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  SwimLaneBoard,
  SwimLaneBoardCell,
  SwimLaneBoardColumn,
  SwimLaneBoardItem,
  SwimLaneBoardLane
} from "../../app/component/brand/stylex/swim-lane-board"

const dnd = vi.hoisted(() => ({ context: undefined as Record<string, (event: any) => void> | undefined }))

vi.mock("@dnd-kit/core", async () => {
  const React = await import("react")
  return {
    DndContext: ({ children, ...props }: any) => {
      dnd.context = props
      return <div>{children}</div>
    },
    DragOverlay: ({ children }: any) => <div>{children}</div>,
    KeyboardSensor: class {},
    PointerSensor: class {},
    closestCorners: () => [],
    pointerWithin: () => [],
    useDndContext: () => ({ active: null }),
    useDroppable: () => ({ isOver: false, setNodeRef: () => {} }),
    useSensor: () => ({}),
    useSensors: (...sensor: unknown[]) => sensor
  }
})

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => children,
  sortableKeyboardCoordinates: () => ({ x: 0, y: 0 }),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    isDragging: false
  }),
  verticalListSortingStrategy: "vertical"
}))

vi.mock("@dnd-kit/utilities", () => ({ CSS: { Translate: { toString: () => undefined } } }))

afterEach(() => {
  cleanup()
  dnd.context = undefined
})

function Board({ onItemMove = vi.fn(), collapsedColumnIds, onCollapsedColumnIdsChange = vi.fn() }: any) {
  return (
    <SwimLaneBoard
      label="Work"
      autoCollapse="never"
      onItemMove={onItemMove}
      collapsedColumnIds={collapsedColumnIds}
      onCollapsedColumnIdsChange={onCollapsedColumnIdsChange}
      rowMaxHeight={200}>
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardColumn id="done" label="Done" count={0} />
      <SwimLaneBoardLane id="lane" label="Lane" count={1}>
        <SwimLaneBoardCell columnId="todo">
          <SwimLaneBoardItem id="a">A</SwimLaneBoardItem>
        </SwimLaneBoardCell>
        <SwimLaneBoardCell columnId="done" />
      </SwimLaneBoardLane>
    </SwimLaneBoard>
  )
}

const dragEvent = (over: unknown, keyboard = false) => ({
  active: { id: "a", data: { current: { type: "item", coordinate: { laneId: "lane", columnId: "todo", index: 0 } } } },
  over,
  activatorEvent: keyboard ? new KeyboardEvent("keydown") : new MouseEvent("pointerdown")
})

test("swim lane board reports pointer and keyboard move intents", () => {
  const move = vi.fn()
  render(<Board onItemMove={move} />)
  const destination = {
    id: "cell",
    data: { current: { type: "cell", coordinate: { laneId: "lane", columnId: "done", index: 0 } } }
  }

  dnd.context!.onDragStart!(dragEvent(destination))
  dnd.context!.onDragEnd!(dragEvent(destination))
  expect(move).toHaveBeenLastCalledWith({
    itemId: "a",
    source: { laneId: "lane", columnId: "todo", index: 0 },
    destination: { laneId: "lane", columnId: "done", index: 0 },
    sourceEvent: "pointer"
  })

  dnd.context!.onDragEnd!(dragEvent(destination, true))
  expect(move).toHaveBeenLastCalledWith(expect.objectContaining({ sourceEvent: "keyboard" }))
})

test("swim lane board ignores invalid drops and supports controlled column toggles", () => {
  const move = vi.fn()
  const change = vi.fn()
  render(<Board onItemMove={move} collapsedColumnIds={[]} onCollapsedColumnIdsChange={change} />)

  dnd.context!.onDragEnd!(dragEvent(null))
  dnd.context!.onDragEnd!({ ...dragEvent({ id: "bad", data: { current: {} } }) })
  dnd.context!.onDragCancel!(undefined)
  expect(move).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: "Collapse Todo" }))
  expect(change).toHaveBeenCalledWith(["todo"])
})

test("swim lane board renders uncontrolled and collapsed single-row configurations", () => {
  const { unmount } = render(
    <SwimLaneBoard label="Single" defaultCollapsedColumnIds={["done"]} rowMaxHeight="20rem">
      <SwimLaneBoardColumn id="todo" label="Todo" count={1} />
      <SwimLaneBoardColumn id="done" label="Done" count={0} />
      <SwimLaneBoardCell columnId="todo">Ready</SwimLaneBoardCell>
    </SwimLaneBoard>
  )
  expect(screen.getByRole("button", { name: "Expand Done" })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Expand Done" }))
  expect(screen.getByText("Ready")).toBeTruthy()

  unmount()
  render(
    <SwimLaneBoard label="Empty" autoCollapse="empty">
      <SwimLaneBoardColumn id="empty" label="Empty" count={0} />
      <SwimLaneBoardCell columnId="empty" />
    </SwimLaneBoard>
  )
  expect(screen.getByRole("button", { name: "Expand Empty" })).toBeTruthy()
})
