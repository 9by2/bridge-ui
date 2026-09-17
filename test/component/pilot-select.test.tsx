import { Select as Primitive } from "@base-ui/react/select"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from "../../app/component/brand/stylex/select"
import { Theme } from "../../app/component/brand/stylex/theme"

afterEach(cleanup)
test("select supports callback style, invalid state and alternate placement", async () => {
  for (const invalid of [true, "true", false] as const) {
    const { unmount } = render(
      <Select open defaultValue="a">
        <SelectTrigger size="sm" aria-invalid={invalid} className={() => "trigger"}>
          <SelectValue className={() => "value"} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false} side="top" className={() => "popup"}>
          <SelectGroup className={() => "group"}>
            <SelectLabel className={() => "label"}>Label</SelectLabel>
            <SelectItem value="a" className={() => "item"}>
              A
            </SelectItem>
            <SelectSeparator className={() => "separator"} />
            <SelectScrollUpButton keepMounted className={() => "up"} />
            <SelectScrollDownButton keepMounted className={() => "down"} />
          </SelectGroup>
        </SelectContent>
      </Select>
    )
    expect((await screen.findByRole("option")).className).toContain("item")
    expect(document.querySelector(".up")).not.toBeNull()
    unmount()
  }
})
test("select retains root identity, selection, form and portal theme", async () => {
  expect(Select).toBe(Primitive.Root)
  const change = vi.fn()
  const { container } = render(
    <Theme mode="dark">
      <form>
        <Select name="choice" defaultValue="a" onValueChange={change}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Choice</SelectLabel>
              <SelectItem value="a">Alpha</SelectItem>
              <SelectSeparator />
              <SelectItem value="b">Beta</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </form>
    </Theme>
  )
  fireEvent.click(screen.getByRole("combobox"))
  const option = await screen.findByRole("option", { name: "Beta" })
  expect(option.closest("[data-pilot-theme]")?.getAttribute("data-pilot-theme")).toBe("dark")
  fireEvent.keyDown(option, { key: "Enter" })
  expect(change.mock.calls[0]?.[0]).toBe("b")
  expect(new FormData(container.querySelector("form")!).get("choice")).toBe("b")
})

test("unstyled select preserves icon, forwarding and selection semantics", async () => {
  const change = vi.fn()
  render(
    <Select defaultValue="a" onValueChange={change}>
      <SelectTrigger appearance="unstyled" aria-label="Role" data-contract="unstyled">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Admin</SelectItem>
        <SelectItem value="b">Member</SelectItem>
      </SelectContent>
    </Select>
  )
  const trigger = screen.getByRole("combobox", { name: "Role" })
  expect(trigger.dataset.appearance).toBe("unstyled")
  expect(trigger.dataset.contract).toBe("unstyled")
  expect(trigger.querySelector("svg")).not.toBeNull()
  fireEvent.click(trigger)
  fireEvent.keyDown(await screen.findByRole("option", { name: "Member" }), { key: "Enter" })
  expect(change.mock.calls[0]?.[0]).toBe("b")
})
