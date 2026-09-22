import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Body, Heading, TypographyLabel, WAIHeading } from "../../app"
import { Label } from "../../app/component/brand/stylex/typography"

afterEach(cleanup)

test("typography preserves Cue semantic elements and heading scale selection", () => {
  const { container } = render(
    <>
      <Heading>Default section heading</Heading>
      <Heading as={WAIHeading.H1}>Page heading</Heading>
      <Heading as={WAIHeading.H2}>Section heading</Heading>
      <Heading as={WAIHeading.H3}>Subsection heading</Heading>
      <TypographyLabel>Root field label</TypographyLabel>
      <Label>Direct field label</Label>
      <Body>Supporting text</Body>
    </>
  )

  expect(screen.getByRole("heading", { level: 4 }).textContent).toBe("Default section heading")
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Page heading")
  expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Section heading")
  expect(screen.getByRole("heading", { level: 3 }).textContent).toBe("Subsection heading")
  expect(screen.getByText("Root field label").tagName).toBe("SPAN")
  expect(screen.getByText("Direct field label").tagName).toBe("SPAN")
  expect(container.querySelector("p")?.textContent).toBe("Supporting text")
})
