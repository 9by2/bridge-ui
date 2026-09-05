import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.NavigationMenu>
      <UI.NavigationMenuList>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuTrigger>Products</UI.NavigationMenuTrigger>
          <UI.NavigationMenuContent>
            <div className="grid w-72 gap-2 p-3">
              <UI.NavigationMenuLink href="#overview">
                Overview<span className="text-sm text-muted-foreground">Explore the shared interface library.</span>
              </UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#components">
                Component<span className="text-sm text-muted-foreground">Build a consistent interface.</span>
              </UI.NavigationMenuLink>
            </div>
          </UI.NavigationMenuContent>
        </UI.NavigationMenuItem>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuTrigger>Learn</UI.NavigationMenuTrigger>
          <UI.NavigationMenuContent>
            <div className="grid w-72 gap-2 p-3">
              <UI.NavigationMenuLink href="#guide">Getting started</UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#accessibility">Accessibility</UI.NavigationMenuLink>
              <UI.NavigationMenuLink href="#theme">Theme</UI.NavigationMenuLink>
            </div>
          </UI.NavigationMenuContent>
        </UI.NavigationMenuItem>
        <UI.NavigationMenuItem>
          <UI.NavigationMenuLink href="#documentation">Documentation</UI.NavigationMenuLink>
        </UI.NavigationMenuItem>
      </UI.NavigationMenuList>
    </UI.NavigationMenu>
  )
}
