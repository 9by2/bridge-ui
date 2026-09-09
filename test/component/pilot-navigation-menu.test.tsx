import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuIndicator,
  NavigationMenuPositioner
} from "../../app/component/brand/stylex/navigation-menu"

afterEach(cleanup)
test("navigation callback and indicator contract", async () => {
  for (const callback of [false, true]) {
    const className = callback ? () => "caller" : "caller"
    const { unmount } = render(
      <NavigationMenu defaultValue="a" className={className}>
        <NavigationMenuList className={className}>
          <NavigationMenuItem value="a" className={className}>
            <NavigationMenuTrigger className={className}>
              Open
              <NavigationMenuIndicator className={className} />
            </NavigationMenuTrigger>
            <NavigationMenuContent className={className}>
              <NavigationMenuLink href="#target" className={className}>
                Target
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPositioner className={className} />
      </NavigationMenu>
    )
    expect(await screen.findAllByText("Target")).not.toHaveLength(0)
    unmount()
  }
})
test("navigation menu preserves popup and native link", async () => {
  render(
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="a">
          <NavigationMenuTrigger>Open</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#target">Target</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
  fireEvent.click(screen.getByRole("button", { name: "Open" }))
  expect((await screen.findByRole("link", { name: "Target" })).getAttribute("href")).toBe("#target")
  expect(navigationMenuTriggerStyle()).toBeTypeOf("string")
})
