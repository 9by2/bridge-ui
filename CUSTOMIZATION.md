# Customization

Bridge UI components expose semantic props and accept `className` for product-specific layout. Import the package stylesheet once before rendering components.

```tsx
import "@bridge/ui/style.css"
```

## Theme customization

Wrap an application or a nested product region in `Theme` to customize the supported Bridge UI color, radius, and spacing system. Customization is scoped: nested Themes inherit values they do not replace. Package overlays such as Dialog, Popover, Toast, and Sonner retain the nearest Theme values.

### Default setup

Use `Theme` without overrides for the canonical Bridge UI default. This is the recommended application root unless a product has an approved custom theme.

```tsx
import { Theme } from "@bridge/ui"
import "@bridge/ui/style.css"

export function App() {
  return (
    <Theme>
      <Routes />
    </Theme>
  )
}
```

`<Theme />` uses `mode="light"` and `density={bridgeDensity.default}`. Use `mode="dark"`, `mode="cue"`, or `mode="future"` only when selecting an existing package palette.

### Custom setup

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

## MetricTile

Select a required `variants` on every tile: `featured` for prominent metrics, `standard` for regular cards, or `compact` for dense summaries. There is no implicit variant. `label`, `value`, `description`, and `icon` are caller-supplied; pass formatted numbers and translated copy. `loading` requires caller-supplied `loadingLabel` to announce progress without rendering a stale value. The icon is decorative. The application owns grid spans, responsive layout, data, and any navigation; the tile itself is not clickable.

```tsx
import { MetricTile } from "@bridge/ui/metric-tile"

<MetricTile variants="featured" label="Revenue" value="฿204,215" description="Successful orders" />
<MetricTile variants="standard" label="Orders" value="753" />
<MetricTile variants="compact" label="Staff" value="7" />
```

## Button

`Button` uses Cue's complete control recipe in `mode="cue"`, including variants, sizes, focus treatment, disabled state, expanded outline and ghost states, icon spacing, and CTA gradient motion. Use `variant` and `size` to select that contract; use `className` only for product layout.

```tsx
<Button variant="outline" size="sm" aria-expanded={open}>
  Filter
</Button>
```

## Sheet

Set `resizable` on `SheetContent` to show a centered pointer drag handle on the sheet edge facing the application. Supply `size` and `onSizeChange` from the consuming composition; the component neither stores nor persists dimensions. Left and right sheets resize horizontally and default to `maxWidth="80vw"`; top and bottom sheets resize vertically and default to `maxHeight="70vh"`. Pass the matching prop to override that maximum.

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@bridge/ui"

const [inspectorWidth, setInspectorWidth] = useState(384)

<Sheet>
  <SheetTrigger>Open inspector</SheetTrigger>
  <SheetContent
    side="right"
    resizable
    size={inspectorWidth}
    onSizeChange={setInspectorWidth}
    maxWidth="48rem">
    <SheetHeader>
      <SheetTitle>Inspector</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

Pass `onClose` when the consuming composition must keep a Sheet open until a condition is met. Return `false` to prevent close requests from the close button, Escape, and the backdrop; return `true` or omit the callback to allow dismissal.

```tsx
<Sheet open={open} onOpenChange={setOpen} onClose={() => isConfirmed}>
  <SheetContent>...</SheetContent>
</Sheet>
```

## BridgeCalendar

`BridgeCalendar` is a client-side schedule calendar with scheduled, week, and month views. It is separate from `Calendar`, the date-picker component. Import the package style once and provide every visible label from the application so product translation stays outside the package.

```tsx
import { BridgeCalendar, type BridgeCalendarLabels } from "@bridge/ui/bridge-calendar"
import "@bridge/ui/style.css"

const labels: BridgeCalendarLabels = {
  previous: "Previous period",
  next: "Next period",
  today: "Today",
  view: { scheduled: "Schedule", week: "Week", month: "Month" },
  weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  period: ({ view, date, week }) =>
    view === "week" && week ? `${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()}` : `${view}: ${date.toLocaleDateString()}`,
  time: (hour, minute = 0) => `${hour}:${String(minute).padStart(2, "0")}`,
  currentTime: "Current time",
  moreEvent: (count) => `+${count} more`
}

<BridgeCalendar
  defaultView="week"
  events={events}
  labels={labels}
  onEventActivate={(event) => openEvent(event.id)}
  onSlotSelect={(selection) => createDraft(selection)}
/>
```

Use `view` and `date` with `onViewChange` and `onDateChange` for controlled state; use `defaultView` and `defaultDate` otherwise. `period` formats the displayed period and receives the visible week range in week view. Events and holidays use generic `id`, `title`, `start`, and `end` fields. Set `allDay` for full-day events: these render in a separate week lane and as compact inverted month pills prefixed with `[ALL DAY]`, without a time prefix. Set `weekStartsOn` from `0` through `6` to select the first displayed weekday. Map queue status, location, translated event copy, fetching, mutations, and authorization in the application before rendering. Use `renderEvent` or `renderEmpty` when the default generic presentation is insufficient.

### Supported P0 components

The global theme contract currently applies to these owned components:

| Family          | Color                                           | Radius  | Density / spacing           |
| --------------- | ----------------------------------------------- | ------- | --------------------------- |
| Button          | primary action                                  | control | control padding             |
| Input, Textarea | input text/border/ring                          | control | control padding             |
| Card            | surface, border, muted footer                   | surface | surface padding, layout gap |
| Dialog          | dialog, dialog foreground, border, muted footer | overlay | surface padding, layout gap |
| Popover         | popover surface/text                            | overlay | surface padding, layout gap |
| Toast           | surface, border, text                           | overlay | surface padding, layout gap |
| Sonner          | normal toast surface/text/border                | overlay | Sonner radius               |

Other components retain their existing public props and default geometry until they are added to this matrix. Generated Shadcn source is not a CSS override target and is never manually edited by Bridge UI consumers.

### Public variables

`Theme` sets the variables below. They are the stable CSS runtime contract for a host that cannot render React, although the `Theme` component is recommended for inheritance, mode, and portal handling.

```css
.partner-region {
  --bridge-color-primary: rebeccapurple;
  --bridge-color-primary-foreground: white;
  --bridge-color-surface: papayawhip;
  --bridge-color-surface-foreground: oklch(0.18 0 0);
  --bridge-color-dialog: midnightblue;
  --bridge-color-dialog-foreground: white;
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

Supported color keys are `background`, `foreground`, `primary`, `primaryForeground`, `surface`, `surfaceForeground`, `dialog`, `dialogForeground`, `popover`, `popoverForeground`, `border`, `input`, `muted`, `mutedForeground`, and `ring`. Bridge UI supplies accessible defaults; a custom palette remains responsible for adequate text and focus contrast.

Use component props for intentional local exceptions, for example `<Card radius="none" />`. Do not rely on StyleX class names, `pilot-*` classes, or undocumented `data-slot` selectors as a customization API.

## Page layout

`Page` is full-width by default. Pass `variant="container"` only when the composition needs the package's 1480px centered content width.

```tsx
import { Page } from "@bridge/ui/page"

export function Report() {
  return <Page variant="container">Constrained report content</Page>
}
```

## Typography

`Heading`, `Label`, and `Body` provide the Cue semantic typography baseline. Heading uses the package heading family and highlight color; `Body` preserves Cue's compact `1.3` line height. Pass `as` to choose a semantic heading level, or omit it for an `h4`.

Always use `Heading` for semantic document headings, including content displayed below a `PageHeader`. Do not add raw `h1` through `h6` elements or local heading font-family rules; select the correct semantic level through `WAIHeading` and use `className` only for local layout.

```tsx
import { Body, Heading, WAIHeading } from "@bridge/ui"

export function AccountSummary() {
  return (
    <section>
      <Heading as={WAIHeading.H2}>Account</Heading>
      <Body>Manage access and profile details.</Body>
    </section>
  )
}
```

`TypographyLabel` renders an inline `span`; the direct `@bridge/ui/typography` module also exports Cue's `Label` name. All three primitives accept native element props and `className` for local layout.

## Input icons

The published `@bridge/ui/style.css` sets Input's Cue control radius to `0.5em` relative to its own font size. `theme.radius.control` still overrides it; other modes use the stylesheet's default. Import the package stylesheet for these defaults.

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

## Component reference

Use the catalog for complete states and examples. All components accept their documented native/primitive props and `className` for local layout. Use semantic props and compound children below; do not override private classes, `data-slot`, or generated source.

### Actions and disclosure

| Family                                             | Use supported customization for                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Accordion, Collapsible                             | Controlled `open` state; Trigger and Content composition; Collapsible `line` and `showChevron`. |
| Alert, StickyAlert                                 | Semantic `variant`; action children.                                                            |
| AlertDialog, Dialog, Drawer, Sheet                 | Controlled `open`; Trigger, Content, Header, Footer, Title, Description; `closeLabel`.          |
| Button, ButtonGroup, Toggle, ToggleGroup           | `variant`, `size`, `disabled`; grouped selection state for ToggleGroup.                         |
| DropdownMenu, ContextMenu, Menubar, NavigationMenu | Trigger, item, checkbox/radio, submenu composition; controlled open state where exposed.        |
| Popover, HoverCard, Tooltip                        | Trigger and Content composition; side/alignment/offset placement props.                         |
| Command, Kbd                                       | Command input/list/group/item composition; `Kbd` renders keyboard labels.                       |
| Pagination                                         | Page, previous, next, and link composition; current-page semantics.                             |
| WizardStep                                         | Step status and action children.                                                                |

### Fields and selection

| Family                                      | Use supported customization for                                                                                                                           |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checkbox, RadioGroup, Switch                | Controlled `checked`/`value`; label and description composition. Checkbox `success`; Bridge `Switch` retains `sm`.                                        |
| Combobox, MultiSelect, Select, NativeSelect | Controlled value/open state; option/item children; empty, clear, search, and `ComboboxButton` content where provided. Bridge `Select` retains `unstyled`. |
| Input, Textarea                             | `icon` only for decorative leading icons; `invalid`, `disabled`, native field props, and Textarea `unstyled`.                                             |
| InputGroup, InputOtp                        | Addon, button, text, and input composition; use InputGroup for interactive adornments.                                                                    |
| Calendar                                    | Controlled selected value; locale, month, and disabled-date rules.                                                                                        |
| Slider                                      | Controlled value, range, min/max/step, accessible label, `rangeColor`, `thumbColor`, and optional `thumbContent`.                                         |
| Field, Label                                | Label, description, error, and control composition.                                                                                                       |
| DropArea, Attachment                        | Accepted file rules, upload state, callbacks, previews, and action slots.                                                                                 |
| Questionnaire                               | Question, answer, validation, and navigation composition.                                                                                                 |

### Layout and navigation

| Family                                        | Use supported customization for                                                                                                                    |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| AspectRatio, Resizable, ScrollArea, Separator | Ratio, pane direction/default sizes, viewport behavior, and orientation.                                                                           |
| Card, Table                                   | Card `radius`/`size`/`ghost`; Table `variant="frame"`, density, hint, viewport, columns, rows, and empty content. `TableFrame` remains compatible. |
| Carousel                                      | Controlled slide API, orientation, and previous/next controls.                                                                                     |
| Page, ShellHeader, Sidebar                    | Page `variant`, spacing/layout props, header slots; Sidebar provider, rail, trigger, and collapsible state.                                        |
| Tabs                                          | Controlled value; List, Trigger, and Content composition. Bridge `capsule` is additive to Cue defaults.                                            |
| Breadcrumb                                    | Item/link/separator composition; custom separator children.                                                                                        |
| Direction                                     | `dir="ltr"` or `dir="rtl"` subtree direction.                                                                                                      |
| ResponsiveImage                               | Responsive source, alt text, loading, and aspect-ratio props.                                                                                      |

### Status, feedback, and display

| Family                                        | Use supported customization for                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Avatar, Badge, Marker, StatusStamp            | Size and semantic variant; Badge includes info/pending and retains `success`/`partial-success`; StatusStamp supports neutral, info, pending, inactive, partial-success, success, warning, destructive.                                                                                                                                                                           |
| Bubble, Message, MessageScroller              | Sender/status metadata, message actions, scroll/loading behavior.                                                                                                                                                                                                                                                                                                                |
| DataState, Empty, Skeleton, Spinner           | Loading, empty, error, retry, and custom action content.                                                                                                                                                                                                                                                                                                                         |
| DetailItem, Item, SettingItem, Settings       | Label/value, icon, action, description, and grouped-item composition.                                                                                                                                                                                                                                                                                                            |
| Progress, SuccessBurst                        | Progress value/status; completion animation trigger.                                                                                                                                                                                                                                                                                                                             |
| Toast, Sonner                                 | Toast provider/viewport and action composition; Sonner global options and toast API.                                                                                                                                                                                                                                                                                             |
| SwimLaneBoard                                 | Compound column/lane/cell/item composition; controlled column collapse ids; `autoCollapse="never"` opt-out; `rowMaxHeight` scroll boundary (default `66vh`). Providing `onItemMove` enables sortable pointer/keyboard drag and emits caller-owned post-drop intent; omitting it keeps the board read-only. Theme colors, density, radius, border, and ring inherit from `Theme`. |
| Kanban                                        | Controlled column-keyed item value; `getItemValue`; `KanbanBoard`, `KanbanColumn`, `KanbanColumnContent`, `KanbanItem`, optional handles and overlay. Use `onMove` for caller-owned persistence intent.                                                                                                                                                                          |
| TicketCard, TicketCover, ProductItem, Receipt | Semantic content slots, image/media, metadata, and action children.                                                                                                                                                                                                                                                                                                              |
| TimelineStep                                  | State, icon, title, description, and connector composition.                                                                                                                                                                                                                                                                                                                      |
| UploadList, UploadPreview, UploadViewer       | File state, preview renderer, item actions, and download/remove callbacks.                                                                                                                                                                                                                                                                                                       |

### Data, media, and utilities

| Family                 | Use supported customization for                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chart, TsChart         | Data, series/config, axes, tooltip/legend, and empty/loading content.                                                                                 |
| ImageCrop              | ReactCrop-compatible controlled crop, constraints, callbacks, selection display, and accessible labels. `ImageCropEditor` retains File-to-PNG output. |
| QrCode                 | Value, error-correction level, size, and foreground/background props.                                                                                 |
| FractalGlass, FlipText | Content, animation state, and reduced-motion-safe product behavior.                                                                                   |
| MessageScroller        | Scroll anchoring, loading state, and message children.                                                                                                |
| Receipt                | Structured line items, totals, metadata, and print/product actions.                                                                                   |

### Foundation

| Family                   | Use supported customization for                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Theme                    | `mode`, `density`, and typed `theme` overrides; see Theme customization above.                                                      |
| Typography               | `Heading as`, semantic `Body`/`Label`, and `className` for local layout.                                                            |
| TypographyLabel          | Inline label primitive; use `Label` for form-label semantics.                                                                       |
| Accessibility primitives | `Label`, `Kbd`, `Separator`, and `Direction` preserve package semantics; provide labels and text alternatives from the application. |
