import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  buttonGroupVariants
} from "../../internal/pilot/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea
} from "../../internal/pilot/input-group"
import {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter
} from "../../internal/pilot/item"
import { Label } from "../../internal/pilot/label"
import { ToggleGroup, ToggleGroupItem } from "../../internal/pilot/toggle-group"

afterEach(cleanup)

test("button group preserves helper, render and separator orientation", () => {
  const horizontal = render(
    <ButtonGroup>
      <ButtonGroupSeparator orientation="horizontal" className={() => "separator"} />
    </ButtonGroup>
  )
  expect(document.querySelector(".separator")).not.toBeNull()
  horizontal.unmount()
  for (const orientation of [undefined, null, "horizontal", "vertical"] as const) {
    const { unmount } = render(
      <ButtonGroup orientation={orientation}>
        <ButtonGroupText render={<span />}>Prefix</ButtonGroupText>
        <ButtonGroupSeparator />
        <button>Action</button>
      </ButtonGroup>
    )
    expect(screen.getByText("Prefix").tagName).toBe("SPAN")
    expect(buttonGroupVariants({ orientation, className: "caller" })).toContain("caller")
    unmount()
  }
  expect(buttonGroupVariants()).toBeTypeOf("string")
})

test("compound variant and callback contract", () => {
  for (const spacing of [1, -1, 0.5]) {
    const { unmount } = render(
      <ToggleGroup spacing={spacing}>
        <ToggleGroupItem value="a" variant={null} size={null}>
          A
        </ToggleGroupItem>
      </ToggleGroup>
    )
    expect(screen.getByRole("button").getAttribute("data-spacing")).toBe(String(spacing))
    unmount()
  }
  const standalone = render(<ToggleGroupItem value="outside">Outside</ToggleGroupItem>)
  expect(screen.getByRole("button").getAttribute("data-size")).toBe("default")
  standalone.unmount()
  const defaultGroup = render(
    <ToggleGroup style={{ margin: 3 }}>
      <ToggleGroupItem value="default">Default</ToggleGroupItem>
    </ToggleGroup>
  )
  expect(screen.getByRole("button").getAttribute("data-size")).toBe("default")
  defaultGroup.unmount()
  for (const size of [undefined, null, "default", "sm", "lg"] as const) {
    for (const orientation of ["horizontal", "vertical"] as const) {
      const { unmount } = render(
        <ToggleGroup
          size={size}
          variant={null}
          spacing={0}
          orientation={orientation}
          className={() => "group"}
          style={() => ({ margin: 2 })}>
          <ToggleGroupItem value="a" size={size} variant="outline" className={() => "item"}>
            A
          </ToggleGroupItem>
        </ToggleGroup>
      )
      expect(screen.getByRole("button").className).toContain("item")
      unmount()
    }
  }
  for (const size of [null, "xs", "sm", "icon-xs", "icon-sm"] as const) {
    const { unmount } = render(<InputGroupButton size={size}>Action</InputGroupButton>)
    expect(screen.getByRole("button").getAttribute("data-size")).toBe(size)
    unmount()
  }
  for (const size of [undefined, null, "default", "sm", "xs"] as const) {
    for (const variant of [undefined, null, "default", "outline", "muted"] as const) {
      const { unmount } = render(
        <Item size={size} variant={variant}>
          <ItemMedia />
          <ItemSeparator className={() => "separator"} />
        </Item>
      )
      expect(document.querySelector(".separator")).not.toBeNull()
      unmount()
    }
  }
})

test("item retains render composition and every structural slot", () => {
  const click = vi.fn()
  render(
    <ItemGroup>
      <Item variant="outline" size="xs" render={<a href="#item" />} onClick={click}>
        <ItemHeader>Header</ItemHeader>
        <ItemMedia variant="image">
          <img alt="Preview" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Title</ItemTitle>
          <ItemDescription>Copy</ItemDescription>
        </ItemContent>
        <ItemActions>Action</ItemActions>
        <ItemFooter>Footer</ItemFooter>
      </Item>
      <ItemSeparator />
    </ItemGroup>
  )
  fireEvent.click(screen.getByRole("link"))
  expect(click).toHaveBeenCalledOnce()
  expect(screen.getByRole("link").getAttribute("data-size")).toBe("xs")
  expect(screen.getByRole("list").querySelectorAll("[data-slot]").length).toBeGreaterThan(8)
})

test("input group addon focuses input without stealing button action", () => {
  const click = vi.fn()
  render(
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>Prefix</InputGroupText>
        <InputGroupButton onClick={click}>Action</InputGroupButton>
      </InputGroupAddon>
      <InputGroupInput aria-label="Value" defaultValue="hello" />
    </InputGroup>
  )
  fireEvent.click(screen.getByText("Prefix"))
  expect(document.activeElement).toBe(screen.getByRole("textbox"))
  screen.getByRole("button").focus()
  fireEvent.click(screen.getByRole("button"))
  expect(click).toHaveBeenCalledOnce()
  expect(document.activeElement).toBe(screen.getByRole("button"))
  expect(screen.getByRole("button").getAttribute("type")).toBe("button")
})

test("input group retains native form and addon override", () => {
  const click = vi.fn()
  const { container } = render(
    <form>
      <InputGroup>
        <InputGroupTextarea name="copy" defaultValue="Text" />
        <InputGroupAddon align="block-end" onClick={click}>
          Footer
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
  fireEvent.click(screen.getByText("Footer"))
  expect(click).toHaveBeenCalledOnce()
  expect(new FormData(container.querySelector("form")!).get("copy")).toBe("Text")
})

test("label retains native association and caller ref", () => {
  const ref = vi.fn()
  render(
    <>
      <Label htmlFor="name" ref={ref} className="caller">
        Name
      </Label>
      <input id="name" />
    </>
  )
  expect(screen.getByLabelText("Name").id).toBe("name")
  expect(ref).toHaveBeenCalledWith(screen.getByText("Name"))
  expect(screen.getByText("Name").className).toContain("caller")
})

test("toggle group retains controlled selection and context override", () => {
  const change = vi.fn()
  const { rerender } = render(
    <ToggleGroup value={[]} onValueChange={change} variant="outline" size="sm" spacing={0}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>
  )
  fireEvent.click(screen.getByRole("button", { name: "A" }))
  expect(change.mock.calls[0]?.[0]).toEqual(["a"])
  expect(screen.getByRole("button", { name: "A" }).getAttribute("data-size")).toBe("sm")
  rerender(
    <ToggleGroup value={["a"]} orientation="vertical">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b" disabled>
        B
      </ToggleGroupItem>
    </ToggleGroup>
  )
  expect(screen.getByRole("button", { name: "A" }).getAttribute("aria-pressed")).toBe("true")
  expect(screen.getByRole("button", { name: "B" }).hasAttribute("disabled")).toBe(true)
})
