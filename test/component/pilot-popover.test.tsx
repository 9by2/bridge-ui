import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { HoverCard, HoverCardTrigger, HoverCardContent } from "../../app/component/brand/stylex/hover-card"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription
} from "../../app/component/brand/stylex/popover"
import { Theme } from "../../app/component/brand/stylex/theme"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../../app/component/brand/stylex/tooltip"

afterEach(cleanup)

test("overlay alternate placement and callback style", () => {
  for (const side of ["top", "bottom", "left", "right"] as const) {
    const { unmount } = render(
      <>
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Tip</TooltipTrigger>
            <TooltipContent side={side} className={() => "tip"}>
              Help
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <HoverCard open>
          <HoverCardTrigger href="#hover">Hover</HoverCardTrigger>
          <HoverCardContent side={side}>Detail</HoverCardContent>
        </HoverCard>
      </>
    )
    expect(screen.getByText("Help").className).toContain("tip")
    unmount()
  }
})

test("tooltip preserves provider and accessible portal", async () => {
  render(
    <Theme mode="dark">
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Help</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Theme>
  )
  expect((await screen.findByText("Help")).getAttribute("data-slot")).toBe("tooltip-content")
  expect(screen.getByText("Help").closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("dark")
})

test("hover card preserves controlled portal and inherited theme", async () => {
  const { unmount } = render(
    <Theme mode="dark">
      <HoverCard open>
        <HoverCardTrigger href="#profile">Profile</HoverCardTrigger>
        <HoverCardContent className={() => "caller"}>Detail</HoverCardContent>
      </HoverCard>
    </Theme>
  )
  expect((await screen.findByText("Detail")).closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe(
    "dark"
  )
  unmount()
})

test("popover supports controlled open and callback styling", () => {
  const { unmount } = render(
    <Popover open>
      <PopoverTrigger>Trigger</PopoverTrigger>
      <PopoverContent className={() => "popup"} side="top" align="start">
        <PopoverTitle className={() => "title"}>Title</PopoverTitle>
        <PopoverDescription className={() => "description"}>Copy</PopoverDescription>
      </PopoverContent>
    </Popover>
  )
  expect(screen.getByText("Title").className).toContain("title")
  expect(screen.getByText("Copy").className).toContain("description")
  unmount()
})

test("popover preserves opposite portal theme and dismissal", async () => {
  render(
    <Theme mode="dark">
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Description</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </Theme>
  )
  fireEvent.click(screen.getByText("Open"))
  expect((await screen.findByText("Title")).closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe(
    "dark"
  )
  fireEvent.keyDown(screen.getByText("Title"), { key: "Escape" })
  await waitFor(() => expect(screen.queryByText("Title")).toBeNull())
})
