import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { Kanban, KanbanBoard, KanbanColumn, KanbanColumnContent, KanbanItem, KanbanItemHandle } from "../../app"

afterEach(cleanup)

type Task = { id: string; title: string }

const value: Record<string, Task[]> = {
  todo: [{ id: "task-1", title: "Write spec" }],
  done: []
}

function Board({ onValueChange = vi.fn() }: { onValueChange?: (value: Record<string, Task[]>) => void }) {
  return (
    <Kanban value={value} onValueChange={onValueChange} getItemValue={(task) => task.id}>
      <KanbanBoard>
        <KanbanColumn value="todo">
          <KanbanColumnContent value="todo">
            <KanbanItem value="task-1">
              <KanbanItemHandle>Write spec</KanbanItemHandle>
            </KanbanItem>
          </KanbanColumnContent>
        </KanbanColumn>
        <KanbanColumn value="done">
          <KanbanColumnContent value="done" data-testid="done-content" />
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  )
}

test("kanban renders labelled sortable item handles", () => {
  render(<Board />)
  expect(screen.getByText("Write spec").getAttribute("data-slot")).toBe("kanban-item-handle")
  expect(screen.getByText("Write spec").closest("[data-slot=kanban-item]")?.getAttribute("data-value")).toBe("task-1")
})

test("disabled items do not expose drag listeners", () => {
  render(
    <Kanban value={value} onValueChange={vi.fn()} getItemValue={(task) => task.id}>
      <KanbanBoard>
        <KanbanColumn value="todo">
          <KanbanColumnContent value="todo">
            <KanbanItem value="task-1" disabled>
              <KanbanItemHandle>Locked task</KanbanItemHandle>
            </KanbanItem>
          </KanbanColumnContent>
        </KanbanColumn>
      </KanbanBoard>
    </Kanban>
  )
  const handle = screen.getByText("Locked task")
  fireEvent.pointerDown(handle)
  expect(handle.getAttribute("data-disabled")).toBe("true")
})

test("kanban exposes every valid drop zone when item dragging starts", () => {
  render(<Board />)
  const handle = screen.getByText("Write spec")
  fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, isPrimary: true, pointerId: 1, pointerType: "mouse" })
  fireEvent.pointerMove(document, {
    buttons: 1,
    clientX: 12,
    clientY: 0,
    isPrimary: true,
    pointerId: 1,
    pointerType: "mouse"
  })
  const item = handle.closest("[data-slot=kanban-item]")
  expect(item?.getAttribute("data-dragging")).toBe("true")
  expect(screen.getByTestId("done-content").getAttribute("data-drop-zone")).toBe("true")
  expect(screen.getByTestId("done-content").getAttribute("data-drop-target")).toBe("false")
})
