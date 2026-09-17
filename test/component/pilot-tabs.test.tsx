import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "../../app/component/brand/stylex/tabs"

afterEach(cleanup)
test("tabs support variant helper and callback style", () => {
  for (const variant of [null, "default", "line", "capsule"] as const) {
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
    expect(screen.getByRole("tablist").getAttribute("data-variant")).toBe(variant === null ? null : variant)
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
test("line tabs use a distinct list treatment", () => {
  expect(tabsListVariants({ variant: "line" })).not.toBe(tabsListVariants({ variant: null }))
})
test("capsule tabs use a distinct list treatment", () => {
  expect(tabsListVariants({ variant: "capsule" })).not.toBe(tabsListVariants({ variant: null }))
})

test("link tabs derive their active presentation from the list", () => {
  render(
    <Tabs defaultValue="one">
      <TabsList variant="link" aria-label="Section">
        <TabsTrigger value="one">Overview</TabsTrigger>
        <TabsTrigger value="two">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Overview panel</TabsContent>
      <TabsContent value="two">Activity panel</TabsContent>
    </Tabs>
  )
  expect(screen.getByRole("tablist").dataset.variant).toBe("link")
  expect(tabsListVariants({ variant: "link" })).not.toBe(tabsListVariants({ variant: "default" }))
  fireEvent.click(screen.getByRole("tab", { name: "Activity" }))
  expect(screen.getByRole("tab", { name: "Activity" }).getAttribute("aria-selected")).toBe("true")
})
