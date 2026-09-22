import { act, cleanup, render } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay
} from "../../app/component/brand/stylex/kanban"

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
    MeasuringStrategy: { Always: "always" },
    PointerSensor: class {},
    defaultDropAnimationSideEffects: () => undefined,
    useSensor: () => ({}),
    useSensors: (...sensor: unknown[]) => sensor
  }
})

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => children,
  arrayMove: <T,>(value: T[], from: number, to: number) => {
    const next = [...value]
    const [item] = next.splice(from, 1)
    if (item !== undefined) next.splice(to, 0, item)
    return next
  },
  defaultAnimateLayoutChanges: () => true,
  rectSortingStrategy: "rect",
  sortableKeyboardCoordinates: () => ({ x: 0, y: 0 }),
  useSortable: () => ({
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
    attributes: {},
    listeners: {},
    isDragging: false
  }),
  verticalListSortingStrategy: "vertical"
}))

vi.mock("@dnd-kit/utilities", () => ({ CSS: { Transform: { toString: () => undefined } } }))

afterEach(() => {
  cleanup()
  dnd.context = undefined
})

type Task = { id: string }
const item = (id: string) => ({ id, data: { current: {} } })
const event = (activeId: string, overId?: string) => ({ active: item(activeId), over: overId ? item(overId) : null })

function Board({ value, onValueChange, onMove }: any) {
  return (
    <Kanban value={value} onValueChange={onValueChange} onMove={onMove} getItemValue={(task: Task) => task.id}>
      <KanbanBoard>
        {Object.keys(value).map((column) => (
          <KanbanColumn key={column} value={column}>
            <KanbanColumnHandle>{column}</KanbanColumnHandle>
            <KanbanColumnContent value={column}>
              {value[column].map((task: Task) => (
                <KanbanItem key={task.id} value={task.id}>
                  <KanbanItemHandle>{task.id}</KanbanItemHandle>
                </KanbanItem>
              ))}
            </KanbanColumnContent>
          </KanbanColumn>
        ))}
      </KanbanBoard>
      <KanbanOverlay>
        {({ value: overlayValue }) => <KanbanItem value={String(overlayValue)}>overlay</KanbanItem>}
      </KanbanOverlay>
    </Kanban>
  )
}

test("kanban commits controlled item and column moves from DnD events", () => {
  const change = vi.fn()
  const value = { todo: [{ id: "a" }, { id: "b" }], done: [{ id: "c" }] }
  render(<Board value={value} onValueChange={change} />)

  act(() => dnd.context!.onDragStart!(event("a", "b")))
  act(() => dnd.context!.onDragEnd!(event("a", "b")))
  expect(change).toHaveBeenLastCalledWith({ todo: [{ id: "b" }, { id: "a" }], done: [{ id: "c" }] })

  act(() => dnd.context!.onDragEnd!(event("a", "done")))
  expect(change).toHaveBeenLastCalledWith({ todo: [{ id: "b" }], done: [{ id: "c" }, { id: "a" }] })

  act(() => dnd.context!.onDragEnd!(event("todo", "done")))
  expect(change).toHaveBeenLastCalledWith({ done: [{ id: "c" }], todo: [{ id: "a" }, { id: "b" }] })
})

test("kanban delegates move metadata and safely ignores cancelled or incomplete drops", () => {
  const change = vi.fn()
  const move = vi.fn()
  const value = { todo: [{ id: "a" }], done: [] }
  render(<Board value={value} onValueChange={change} onMove={move} />)

  act(() => dnd.context!.onDragStart!(event("a", "done")))
  act(() => dnd.context!.onDragOver!(event("a", "done")))
  act(() => dnd.context!.onDragEnd!(event("a", "done")))
  expect(move).toHaveBeenCalledWith(
    expect.objectContaining({ activeContainer: "todo", activeIndex: 0, overContainer: "done", overIndex: 0 })
  )
  expect(change).not.toHaveBeenCalled()

  act(() => dnd.context!.onDragCancel!(undefined))
  act(() => dnd.context!.onDragEnd!(event("missing", "done")))
  act(() => dnd.context!.onDragEnd!(event("a")))
  expect(move).toHaveBeenCalledTimes(1)
})

test("kanban reorders within a column during drag-over and renders an overlay", () => {
  const change = vi.fn()
  const value = { todo: [{ id: "a" }, { id: "b" }] }
  const requestAnimationFrame = globalThis.requestAnimationFrame
  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
    callback(0)
    return 1
  }) as typeof globalThis.requestAnimationFrame
  render(<Board value={value} onValueChange={change} />)

  act(() => dnd.context!.onDragStart!(event("a", "b")))
  act(() => dnd.context!.onDragOver!(event("a", "b")))
  expect(change).toHaveBeenCalledWith({ todo: [{ id: "b" }, { id: "a" }] })
  expect(document.body.textContent).toContain("overlay")
  globalThis.requestAnimationFrame = requestAnimationFrame
})
