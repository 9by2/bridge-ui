# Customization

Bridge UI components expose semantic props and accept `className` for product-specific layout. Import the package stylesheet once before rendering components.

```tsx
import "@bridge/ui/style.css"
```

## Theme customization

Wrap an application or a nested product region in `Theme` to customize the supported Bridge UI color, radius, and spacing system. Customization is scoped: nested Themes inherit values they do not replace. Package overlays such as Dialog, Popover, Toast, and Sonner retain the nearest Theme values.

```tsx
import { Theme, bridgeDensity, type BridgeThemeOverride } from "@bridge/ui"
import "@bridge/ui/style.css"

const ProductTheme = {
  color: {
    primary: "oklch(0.54 0.2 265)",
    primaryForeground: "white",
    surface: "white",
    surfaceForeground: "oklch(0.18 0 0)",
    border: "oklch(0.9 0.01 265)"
  },
  radius: {
    control: "0.375rem",
    controlSmall: "0.25rem",
    surface: "0.75rem",
    overlay: "0.75rem"
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.5rem"
  }
} as const satisfies BridgeThemeOverride

export function App() {
  return (
    <Theme mode="light" density={bridgeDensity.comfortable} theme={ProductTheme}>
      <Routes />
    </Theme>
  )
}
```

`density` supports `bridgeDensity.compact`, `bridgeDensity.default`, and `bridgeDensity.comfortable`. It adjusts shared padding and layout gaps while retaining package control heights and focus behavior.

### Supported P0 components

The global theme contract currently applies to these owned components:

| Family          | Color                            | Radius  | Density / spacing           |
| --------------- | -------------------------------- | ------- | --------------------------- |
| Button          | primary action                   | control | control padding             |
| Input, Textarea | input text/border/ring           | control | control padding             |
| Card            | surface, border, muted footer    | surface | surface padding, layout gap |
| Dialog          | surface, border, muted footer    | overlay | surface padding, layout gap |
| Popover         | popover surface/text             | overlay | surface padding, layout gap |
| Toast           | surface, border, text            | overlay | surface padding, layout gap |
| Sonner          | normal toast surface/text/border | overlay | Sonner radius               |

Other components retain their existing public props and default geometry until they are added to this matrix. Generated Shadcn source is not a CSS override target and is never manually edited by Bridge UI consumers.

### Public variables

`Theme` sets the variables below. They are the stable CSS runtime contract for a host that cannot render React, although the `Theme` component is recommended for inheritance, mode, and portal handling.

```css
.partner-region {
  --bridge-color-primary: rebeccapurple;
  --bridge-color-primary-foreground: white;
  --bridge-color-surface: papayawhip;
  --bridge-color-surface-foreground: oklch(0.18 0 0);
  --bridge-color-border: oklch(0.86 0.02 280);
  --bridge-control-radius: 0.375rem;
  --bridge-control-radius-sm: 0.25rem;
  --bridge-surface-radius: 0.75rem;
  --bridge-overlay-radius: 0.75rem;
  --bridge-space-1: 0.25rem;
  --bridge-space-2: 0.5rem;
  --bridge-space-3: 0.75rem;
  --bridge-space-4: 1rem;
  --bridge-space-5: 1.5rem;
  --bridge-control-padding-inline: 0.625rem;
  --bridge-control-padding-block: 0.25rem;
  --bridge-surface-padding: var(--bridge-space-4);
  --bridge-layout-gap: var(--bridge-space-4);
}
```

Supported color keys are `background`, `foreground`, `primary`, `primaryForeground`, `surface`, `surfaceForeground`, `popover`, `popoverForeground`, `border`, `input`, `muted`, `mutedForeground`, and `ring`. Bridge UI supplies accessible defaults; a custom palette remains responsible for adequate text and focus contrast.

Use component props for intentional local exceptions, for example `<Card radius="none" />`. Do not rely on StyleX class names, `pilot-*` classes, or undocumented `data-slot` selectors as a customization API.

## Input icons

Use `Input`'s `icon` prop for a decorative leading icon. The icon is hidden from assistive technologies; use the input label or `aria-label` to provide its accessible name.

```tsx
import { SearchIcon } from "lucide-react"

import { Input } from "@bridge/ui/input"

export function SearchInput() {
  return <Input icon={<SearchIcon />} aria-label="Search" placeholder="Search" />
}
```

Use `InputGroup` when the adornment is interactive, appears at the trailing edge, or includes supporting content such as a keyboard shortcut.

```tsx
import { SearchIcon, XIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@bridge/ui"

export function SearchGroup() {
  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search" placeholder="Search" />
      <InputGroupButton aria-label="Clear search">
        <XIcon aria-hidden="true" />
      </InputGroupButton>
    </InputGroup>
  )
}
```

Do not place interactive content in `Input`'s `icon` prop.

## Avatar fallback

Use `AvatarFallback` when an image is unavailable. The fallback uses the package foreground token over the muted avatar surface so initials remain readable.

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@bridge/ui"

;<Avatar size="sm">
  <AvatarImage src={profileImageUrl} alt="Nara W." />
  <AvatarFallback>NW</AvatarFallback>
</Avatar>
```
