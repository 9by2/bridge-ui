import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.NavigationMenu>
      <UI.NavigationMenuList>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuTrigger>Products</UI.NavigationMenuTrigger>
          <UI.NavigationMenuContent>
            <UI.NavigationMenuLink href="#components">Components</UI.NavigationMenuLink>
          </UI.NavigationMenuContent>
        </UI.NavigationMenuItem>
      </UI.NavigationMenuList>
    </UI.NavigationMenu>
  )
}
