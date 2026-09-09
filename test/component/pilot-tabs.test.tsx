import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "../../internal/pilot/tabs"

afterEach(cleanup)
test("tabs support variant helper and callback style", () => {
  for (const variant of [null, "default", "line"] as const) {
    const { unmount } = render(
      <Tabs orientation="vertical" defaultValue="a" className={() => "root"}>
        <TabsList variant={variant} className={() => "list"}>
          <TabsTrigger value="a" className={() => "trigger"}>
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a" className={() => "content"}>
          Panel
        </TabsContent>
      </Tabs>
    )
    expect(screen.getByRole("tab").className).toContain("trigger")
    expect(tabsListVariants({ variant })).toBeTypeOf("string")
    unmount()
  }
})
test("tabs preserve selection and panel relationship", () => {
  render(
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">First</TabsContent>
      <TabsContent value="b">Second</TabsContent>
    </Tabs>
  )
  fireEvent.click(screen.getByRole("tab", { name: "B" }))
  expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true")
  expect(screen.getByRole("tabpanel").textContent).toBe("Second")
  expect(tabsListVariants()).toBeTypeOf("string")
})
