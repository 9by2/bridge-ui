import { cleanup, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test } from "vitest"

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../../internal/pilot/resizable"
import { ScrollArea, ScrollBar } from "../../internal/pilot/scroll-area"

afterEach(cleanup)
test("scroll callback style and handle option remain available", () => {
  const { container } = render(<ScrollArea className={() => "callback"}>Content</ScrollArea>)
  expect(container.querySelector(".callback")).not.toBeNull()
  expect(
    renderToString(
      <ResizablePanelGroup>
        <ResizablePanel>A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>B</ResizablePanel>
      </ResizablePanelGroup>
    )
  ).toContain('data-slot="resizable-handle"')
})
test("resizable retains engine composition", () => {
  const html = renderToString(
    <ResizablePanelGroup>
      <ResizablePanel>A</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>B</ResizablePanel>
    </ResizablePanelGroup>
  )
  expect(html).toContain('data-slot="resizable-handle"')
  expect(html).toContain('data-slot="resizable-panel"')
})
test("scroll area preserves content and caller sizing", () => {
  const { container } = render(
    <ScrollArea className="caller" style={{ height: 80 }}>
      <p>Content</p>
      <ScrollBar orientation="horizontal" className={() => "horizontal"} />
    </ScrollArea>
  )
  expect(screen.getByText("Content")).toBeTruthy()
  expect(container.querySelector('[data-slot="scroll-area"]')?.className).toContain("caller")
  expect(container.querySelector('[data-slot="scroll-area-viewport"]')).not.toBeNull()
})
