import { cleanup } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test } from "vitest"

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandDialog
} from "../../app/component/brand/stylex/command"

afterEach(cleanup)
test("command preserves engine server composition", () => {
  const html = renderToString(
    <Command>
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>Empty</CommandEmpty>
        <CommandGroup heading="Action">
          <CommandItem value="a">
            Action<CommandShortcut>A</CommandShortcut>
          </CommandItem>
          <CommandSeparator />
        </CommandGroup>
      </CommandList>
    </Command>
  )
  expect(html).toContain('data-slot="command"')
  expect(html).toContain("cmdk-input")
  expect(
    renderToString(
      <CommandDialog open={false}>
        <Command />
      </CommandDialog>
    )
  ).toBeTypeOf("string")
})
