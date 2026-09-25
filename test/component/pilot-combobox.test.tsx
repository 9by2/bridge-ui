import { Combobox as Primitive } from "@base-ui/react/combobox"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem
} from "../../app/component/brand/stylex/combobox"
import * as UI from "../../app/component/brand/stylex/combobox"

afterEach(cleanup)
test("combobox chip anchor and callback composition", async () => {
  function Example({ callback }: { callback: boolean }) {
    const anchor = UI.useComboboxAnchor()
    const className = callback ? () => "caller" : "caller"
    return (
      <UI.Combobox multiple open items={["Alpha", "Beta"]} defaultValue={["Alpha"]}>
        <UI.ComboboxChips ref={anchor} className={className}>
          <UI.ComboboxValue>
            {(values: string[]) =>
              values.map((value) => (
                <UI.ComboboxChip
                  key={value}
                  showRemove={callback}
                  removeLabel={`Remove ${value}`}
                  className={className}>
                  {value}
                </UI.ComboboxChip>
              ))
            }
          </UI.ComboboxValue>
          <UI.ComboboxChipsInput aria-label="Chip input" className={className} />
        </UI.ComboboxChips>
        <UI.ComboboxContent anchor={anchor} className={className}>
          <UI.ComboboxGroup>
            <UI.ComboboxLabel className={className}>Label</UI.ComboboxLabel>
            <UI.ComboboxList className={className}>
              <UI.ComboboxCollection>
                {(item: string) => (
                  <UI.ComboboxItem key={item} value={item} className={className}>
                    {item}
                  </UI.ComboboxItem>
                )}
              </UI.ComboboxCollection>
            </UI.ComboboxList>
          </UI.ComboboxGroup>
          <UI.ComboboxSeparator className={className} />
        </UI.ComboboxContent>
      </UI.Combobox>
    )
  }
  for (const callback of [false, true]) {
    const { unmount } = render(<Example callback={callback} />)
    expect(await screen.findByRole("option", { name: "Beta" })).toBeTruthy()
    unmount()
  }
})
test("combobox clear and empty composition", async () => {
  for (const callback of [false, true]) {
    const className = callback ? () => "caller" : "caller"
    const { unmount } = render(
      <UI.Combobox open items={[]} defaultValue="Alpha">
        <UI.ComboboxInput showClear showTrigger={false} className={className} />
        <UI.ComboboxContent>
          <UI.ComboboxEmpty className={className}>Empty</UI.ComboboxEmpty>
          <UI.ComboboxList />
        </UI.ComboboxContent>
      </UI.Combobox>
    )
    expect(await screen.findByText("Empty")).toBeTruthy()
    const clear = document.querySelector('[data-slot="combobox-clear"]')
    if (clear) fireEvent.click(clear)
    unmount()
  }
})
test("combobox retains root identity, filtering and selection", async () => {
  expect(Combobox).toBe(Primitive.Root)
  const change = vi.fn()
  render(
    <Combobox items={["Alpha", "Beta"]} onValueChange={change}>
      <ComboboxInput aria-label="Choice" />
      <ComboboxContent>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
  fireEvent.click(screen.getByRole("button"))
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Bet" } })
  const option = await screen.findByRole("option", { name: "Beta" })
  fireEvent.click(option)
  expect(change.mock.calls[0]?.[0]).toBe("Beta")
})
