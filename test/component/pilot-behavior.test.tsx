import {
  DirectionProvider as OriginalProvider,
  useDirection as originalDirection
} from "@base-ui/react/direction-provider"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../../app/component/brand/stylex/collapsible"
import { DirectionProvider, useDirection } from "../../app/component/brand/stylex/direction"

afterEach(cleanup)
test("behavior-only direction retains provider identity", () => {
  expect(DirectionProvider).toBe(OriginalProvider)
  expect(useDirection).toBe(originalDirection)
})
test("collapsible needs no presentation rewrite", async () => {
  render(
    <Collapsible>
      <CollapsibleTrigger>Open</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  )
  fireEvent.click(screen.getByRole("button"))
  expect(await screen.findByText("Content")).toBeTruthy()
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true")
})
