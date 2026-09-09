import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "../../app/component/brand/stylex/accordion"

afterEach(cleanup)
test("accordion callback styling remains supported", () => {
  render(
    <Accordion defaultValue={["a"]} className={() => "root"}>
      <AccordionItem value="a" className={() => "item"}>
        <AccordionTrigger className={() => "trigger"}>Trigger</AccordionTrigger>
        <AccordionContent className={() => "panel"}>Panel</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
  expect(screen.getByRole("button").className).toContain("trigger")
  expect(screen.getByText("Panel").parentElement?.className).toContain("panel")
})
test("accordion keeps primitive expansion and caller content", async () => {
  render(
    <Accordion>
      <AccordionItem value="a">
        <AccordionTrigger>Open</AccordionTrigger>
        <AccordionContent className="caller">Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
  fireEvent.click(screen.getByRole("button", { name: "Open" }))
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true")
  expect((await screen.findByText("Content")).className).toContain("caller")
  fireEvent.click(screen.getByRole("button"))
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false")
})
