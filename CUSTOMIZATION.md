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

## ColorPicker

Circular swatch picker with radio semantics (arrow keys move selection). The composing layer declares **everything structural**; the component never infers it:

- `mode` (required): `fill` | `gradient`.
- `kind` (required when `mode="gradient"`): `linear` | `radial` | `conic`, i.e. the CSS gradient function this surface authors.

The composition transforms its payload into that shape and injects it as `option` / `value`. Swatches and values of another mode or kind are not rendered, and the editor never switches kind.

| Mode / kind       | Option                                             | Editor                                           | Emits                          |
| ----------------- | -------------------------------------------------- | ------------------------------------------------ | ------------------------------ |
| `fill`            | `{ type: "fill", value, label, color }`            | color wheel, hex                                 | `#rrggbb`                      |
| `gradient` linear | `{ type: "gradient", value, label, stop, angle? }` | angle (default 135), repeating, stops            | `linear-gradient(45deg, …)`    |
| `gradient` radial | `{ type: "gradient", value, label, stop, shape? }` | `circle` (default) / `ellipse`, repeating, stops | `radial-gradient(circle, …)`   |
| `gradient` conic  | `{ type: "gradient", value, label, stop, angle? }` | from angle (default 0), repeating, stops         | `conic-gradient(from 0deg, …)` |

`stop` is a color string or `{ color, position }` (percentage), with at least two. The stop editor edits color and position and adds or removes stops. `repeating: true` uses `repeating-*-gradient`. A gradient option without `kind` counts as `linear`.

`onValueChange(value, option)` returns the swatch `value` for a preset, or the CSS string for a custom color or gradient, with the structured option. Persist the string; passing it back as `value` renders a selected extra swatch and reopens it in the editor (`colorPickerParse`). Without `option`, the system preset renders: `colorPickerPreset.fill`, or `colorPickerGradientPreset(kind)` for gradients.

Variants: `size` = `sm` | `md` (default) | `lg`; `layout` = `grid` (default, `column` default 6) | `row` (single horizontally scrollable line). `custom={false}` hides the editor. Override copy with `label` (see `colorPickerDefaultLabel`; stop labels are functions of the 1-based index). Override the selected ring color with `--bridge-color-picker-ring`. `colorPickerBackground(option)` returns the CSS `background` for previews.

```tsx
import { ColorPicker, type ColorPickerGradientOption } from "@bridge/ui/color-picker"

// Composition: this surface is a linear banner. Map the product payload into that shape.
const option: ColorPickerGradientOption[] = theme.map((item) => ({
  type: "gradient",
  value: item.id,
  label: t(item.nameKey),
  kind: "linear",
  angle: 135,
  stop: [item.from, item.to]
}))

<ColorPicker mode="gradient" kind="linear" aria-label={t("banner")} option={option} value={value} onValueChange={save} />
<ColorPicker mode="gradient" kind="conic" aria-label={t("ring")} />
<ColorPicker mode="fill" aria-label={t("text")} size="sm" layout="row" custom={false} />
```

## MetricTile

Select a required `variants` on every tile: `featured` for prominent metrics, `standard` for regular cards, or `compact` for dense summaries. There is no implicit variant. `label`, `value`, `description`, and `icon` are caller-supplied; pass formatted numbers and translated copy. `loading` requires caller-supplied `loadingLabel` to announce progress without rendering a stale value. The icon is decorative. The application owns grid spans, responsive layout, data, and any navigation; the tile itself is not clickable.

```tsx
import { MetricTile } from "@bridge/ui/metric-tile"

<MetricTile variants="featured" label="Revenue" value="฿204,215" description="Successful orders" />
<MetricTile variants="standard" label="Orders" value="753" />
<MetricTile variants="compact" label="Staff" value="7" />
```

## RateCard

`RateCard` presents one priced offer. Select a required `variants` for the use case: `row` for managed rate lists (title, status, detail, price and edit action on one wrapping line), `card` for bookable or selectable services, `plan` for comparable tiers with a larger price and feature list, and `inline` for a frameless summary inside another control such as a `SelectTrigger` or `SelectItem`. `inline` renders only phrasing `span` elements, is not a landmark or heading, truncates the title, and inherits the host control accessible name. There is no implicit variant. `highlight` marks the recommended option and exposes `data-highlight`; pair it with `RateCardHighlight` copy such as "Most popular".

Compose only the parts you need: `RateCardHeader`, `RateCardTitle` (defaults to `h3`; use `render={<h2 />}` to match the outline), `RateCardHighlight`, `RateCardContent`, `RateCardDescription`, `RateCardPrice` (`prefix`, `amount`, `period`), `RateCardDetail` with `RateCardDetailItem label`, `RateCardFeatureList` with `RateCardFeature icon`, and `RateCardAction`. The article is named by its title unless `aria-label` or `aria-labelledby` is supplied. Feature icons are decorative.

Pass already formatted amounts and translated copy. Status Badge, Button, DropdownMenu, Checkbox selection, grid layout, currency, rate status and editing remain application-owned.

```tsx
import { RateCard, RateCardAction, RateCardFeature, RateCardFeatureList, RateCardHeader, RateCardHighlight, RateCardPrice, RateCardTitle } from "@bridge/ui/rate-card"

<RateCard variants="row">
  <RateCardContent>
    <RateCardHeader><RateCardTitle>Weekday rate</RateCardTitle><Badge variant="success">Active</Badge></RateCardHeader>
    <RateCardDetail><RateCardDetailItem label="Valid">1 Oct – 31 Dec 2026</RateCardDetailItem></RateCardDetail>
  </RateCardContent>
  <RateCardPrice amount="฿1,500" period="/ hour" />
  <RateCardAction><Button variant="outline" size="sm">Edit</Button></RateCardAction>
</RateCard>

<SelectTrigger>
  <RateCard variants="inline">
    <RateCardHeader><RateCardTitle>Festival</RateCardTitle><Badge variant="info">BMA</Badge></RateCardHeader>
    <RateCardPrice amount="฿250,000" period="60 min" />
  </RateCard>
</SelectTrigger>

<RateCard variants="plan" highlight>
  <RateCardHighlight>Most popular</RateCardHighlight>
  <RateCardHeader><RateCardTitle>Standard</RateCardTitle></RateCardHeader>
  <RateCardPrice amount="฿8,000" period="/ project" />
  <RateCardFeatureList aria-label="Standard includes"><RateCardFeature icon={<Check />}>2 revisions</RateCardFeature></RateCardFeatureList>
  <RateCardAction><Button>Choose Standard</Button></RateCardAction>
</RateCard>
```

## Button

`Button` uses Cue's complete control recipe in `mode="cue"`, including variants, sizes, focus treatment, disabled state, expanded outline and ghost states, icon spacing, and CTA gradient motion. Use `variant` and `size` to select that contract; use `className` only for product layout.

```tsx
<Button variant="outline" size="sm" aria-expanded={open}>
  Filter
</Button>
```

## Which toaster?

The package ships two toast engines. Pair each imperative function with its own toaster; mixing them renders nothing.

| Engine  | Mount                                                   | Call                                                          |
| ------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| Sonner  | `SonnerToaster` (or `Toaster` from `@bridge/ui/sonner`) | `sonnerToast.success()` (or `toast` from `@bridge/ui/sonner`) |
| Base UI | `Toaster` / `ToastProvider`                             | `toast.add()` (root `toast`)                                  |

```tsx
import { SonnerToaster, sonnerToast } from "@bridge/ui"
// or: import { Toaster, toast } from "@bridge/ui/sonner"

export function Shell() {
  return <SonnerToaster />
}

sonnerToast.success("Saved")
```

Import Sonner through the package, not `sonner` directly, so the call and the toaster share one Sonner instance.

## Spinner

`Spinner` accepts `size` (`SpinnerSize`: `sm` 12px, `default` 16px, `lg` 24px). It always renders `role="status"`; pass `aria-label` for context.

```tsx
import { Spinner, SpinnerSize } from "@bridge/ui/spinner"

;<Spinner size={SpinnerSize.lg} aria-label="Loading report" />
```

## Upload validation and issue

`UploadList` validates, reports and renders. It never toasts or shows global feedback; the app decides how to surface issues.

```tsx
import {
  UploadList,
  UploadIssueDisplay,
  UploadListLayout,
  composeUploadValidation,
  sonnerToast,
  uploadValidation
} from "@bridge/ui"

const validate = composeUploadValidation(
  uploadValidation.default({ accept: { "image/*": [] }, maxFiles: 4, maxSize: 2_000_000 }),
  uploadValidation.extension([".png", ".jpg", ".webp"])
)

<UploadList
  value={value}
  onValueChange={(next, change) => setValue(next)} // change.reason: append | replace | remove | clear
  validate={validate}
  onIssue={(issue) => sonnerToast.error(issue[0]?.message)} // app-owned feedback
  issueDisplay={UploadIssueDisplay.inline} // optional role="alert" list; default none
  layout={UploadListLayout.grid}
  renderEmpty={() => <p>{t("noImage")}</p>}
  copy={copy}>
  {t("chooseImage")}
</UploadList>
```

- Builders: `uploadValidation.default({ accept, maxFiles, minFiles, maxSize, minSize, message })`, `.accept(map)` and `.extension(list)`. Combine them with `composeUploadValidation(...)`, or write your own `(file, { value }) => UploadIssue[]`.
- `UploadIssue = { code, message, file? }`, where `code` is an `UploadIssueCode`. An issue with a `file` rejects that file. An issue without one (e.g. `too-few-files`) is advisory and never blocks; enforce minimums at submit.
- Pass translated copy through `message` per `UploadIssueCode`. The built-in messages are English fallbacks.
- `multiple={false}` turns on replace mode: a new selection replaces the value with reason `replace`.
- `renderItem(attachment, { remove, clear, preview, layout })` replaces the default row. Its `remove` keeps the reason and focus behavior.
- `thumbnail` stays caller-owned. For local image previews, create and revoke object URLs in the app, or render them through `renderItem`.
- `onReject` is deprecated; use `onIssue`. It still fires with its old payload.

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

### Event color, muted and holiday

```tsx
const events: BridgeCalendarEvent[] = [
  { id: "a", title: "Launch", start, end, color: statusColor[queue.status] }, // any CSS color; overrides tone
  { id: "b", title: "Cancelled", start, end, muted: true } // de-emphasised; still activatable
]

<BridgeCalendar
  events={events}
  holidays={[{ id: "h", title: t("harvest"), meta: t("officeClosed"), start, end }]}
  renderHoliday={(holiday, { view, date }) => <HolidayBadge holiday={holiday} date={date} />}
  onEventActivate={(event) => openEvent(event.id)}
  onSlotDrop={(slot) => scheduleQueueItem(slot)}
  labels={labels}
/>
```

- `color` is applied through `--bridge-calendar-event-color`. `renderEvent` output can read the same property.
- `renderHoliday` runs once per intersected day in week and month views. By default holidays show `title` and `meta`.
- In month view, the day under an external HTML draggable gets `data-drop-target="true"` and a dashed highlight. The highlight clears on leave, drop or `dragend`, and `onSlotDrop` fires on drop.
- `onEventActivate` covers pointer click and keyboard Enter/Space. Map both the old `onEventClick` and `onEventOpen` to it. Disabled events never activate.

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

Owned StyleX recipes use shared semantic CSS colors. In addition to the `Theme` color keys above, CSS hosts can set `--bridge-color-secondary`, `--bridge-color-secondary-foreground`, `--bridge-color-accent`, `--bridge-color-accent-foreground`, `--bridge-color-destructive`, `--bridge-color-destructive-foreground`, `--bridge-color-warning`, `--bridge-color-warning-foreground`, and the `--bridge-color-sidebar*` family. `--bridge-color-highlight*` and `--bridge-color-brand*` cover brand-specific states. Unset colors retain the selected light, dark, cue, or future mode fallback. Supply readable foreground pairs with each custom surface.

Fonts use `--bridge-font-body`, `--bridge-font-heading`, `--bridge-font-number`, and `--bridge-font-size-{2xs,xs,sm,md,base,lg,xl,2xl,3xl,4xl,5xl,6xl}`. Shared shape variables include the semantic control/surface/overlay radii above, `--bridge-pill-radius`, and `--bridge-radius-{2,3,4,6,8,10,11,12,14,18,26,999,9999}` for recipe details. The default font and radius scales use `em` so they respond to font sizing; font-size `em` is relative to the parent, while radius `em` is relative to the component's own font size. The defaults are declared in `@bridge/ui/style.css`; override them on an ancestor of the target component. Intentionally square or circular shapes remain explicit.

Slider defaults to the shared primary, ring, and background colors; its `rangeColor` and `thumbColor` props remain available for intentional local exceptions. Do not set `--bridge-button-*` or `--bridge-slider-*`: those component-specific CSS override names are not part of the contract.

For a CSS-only brand hotfix, set `--bridge-color-brand`, `--bridge-color-brand-foreground`, `--bridge-color-brand-text`, `--bridge-color-brand-accent`, and `--bridge-color-brand-accent-foreground` on the Theme root or a descendant. Unset names fall back to the selected mode's palette. These variables affect owned brand recipes (success states, link tabs, CTA gradients); supply foreground pairs with adequate contrast. Do not target generated StyleX names.

```css
.partner-region {
  --bridge-color-brand: #087f60;
  --bridge-color-brand-foreground: white;
  --bridge-color-brand-text: #086147;
  --bridge-color-brand-accent: #673ab7;
  --bridge-color-brand-accent-foreground: white;
}
```

### Changing brand colors in this repo

To change the canonical palette, edit the `brand`, `brandForeground`, `brandText`, `brandAccent`, and `brandAccentForeground` defaults in `app/component/brand/stylex/token.stylex.ts` **and** the corresponding light, dark, cue, and future mode values in `app/component/brand/stylex/theme.tsx`. Mode values override the token defaults; changing only the token file does not update every mode.

For a temporary package-wide CSS hotfix instead, add stable public variables to `app/style/component.css` (the source of `@bridge/ui/style.css`). Target all modes with `[data-bridge-theme]`, or only one mode with `[data-bridge-theme="cue"]`:

```css
[data-bridge-theme="cue"] {
  --bridge-color-brand: #087f60;
  --bridge-color-brand-foreground: white;
}
```

This affects Bridge UI brand recipes within that Theme without editing generated StyleX variables. Set the matching foreground and accent variables above when the new palette needs them; check contrast in every affected mode. `app/style/global.css` is catalog-only and is not published.

Use component props for intentional local exceptions, for example `<Card radius="none" />`. Do not rely on StyleX class names, `pilot-*` classes, or undocumented `data-slot` selectors as a customization API.

## Page layout

`Page` is full-width by default. Pass `variant="container"` only when the composition needs the package's 1480px centered content width.

```tsx
import { Page } from "@bridge/ui/page"

export function Report() {
  return <Page variant="container">Constrained report content</Page>
}
```

### Density and width

`density` sets padding and `width` sets max-width and centering. They are independent.

| `density` (`PageDensity`) | Padding                        |
| ------------------------- | ------------------------------ |
| `default`                 | 24 top / 44 inline / 48 bottom |
| `compact`                 | 16 all sides                   |
| `comfortable`             | 24 all sides                   |
| `none`                    | 0                              |

| `width` (`PageWidth`) | Layout                                   |
| --------------------- | ---------------------------------------- |
| omitted / `full`      | 100% (unchanged default)                 |
| `content`             | centered, max 80rem (list, dashboard)    |
| `form`                | centered, max 48rem (settings, form)     |
| `editor`              | full width, zero inline padding (canvas) |

```tsx
import { Page, PageDensity, PageWidth } from "@bridge/ui/page"

;<Page width={PageWidth.content} density={PageDensity.compact}>
  …
</Page>
```

Add responsive gutters with `isDynamicPadding`, or with product layout CSS through `className`.

#### Migration: `spacing` → `density`

`spacing` is deprecated. It still works and takes the same values. `density` wins when both are passed, and `data-spacing` plus `data-density` both carry the resolved value. `spacing` will be removed in the next major.

```diff
- <Page spacing="compact">
+ <Page density="compact">
```

### Header slot and form action

```tsx
<PageHeader>
  <PageHeading>
    <PageEyebrow>Studio</PageEyebrow>
    <PageTitle>Schedule</PageTitle>
    <PageMeta>12 event · Updated 5 minutes ago</PageMeta>
  </PageHeading>
  <PageAction>…</PageAction>
  <PageFilter role="search" aria-label="Schedule filter">…</PageFilter>
</PageHeader>

<PageFormAction sticky align={PageFormActionAlign.end}>
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Save</Button>
</PageFormAction>
```

`PageFilter` takes a full header row. `PageFormAction` `align` is `start` | `end` (default) | `between`. With `sticky`, the row pins to the bottom of the nearest scroll container.

### DataState retry

```tsx
<DataState variant="error" onRetry={refetch} retryLabel={t("retry")}>
  <DataStateTitle>{t("loadFailed")}</DataStateTitle>
</DataState>
```

With `onRetry`, an outline `Button` renders inside `DataStateAction` after `children`. `retryLabel` defaults to `"Retry"`; pass translated copy from the app.

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

Heading font stack is `"Plus Jakarta Sans Variable", aktiv-grotesk, Sarabun, sans-serif`. Plus Jakarta Sans has no Thai glyph, so mixed Thai/English headings render Latin in Plus Jakarta Sans and Thai in `aktiv-grotesk`. The package does not bundle `aktiv-grotesk` (Adobe Fonts); the consumer app must load its own Adobe Fonts kit, e.g. `<link rel="stylesheet" href="https://use.typekit.net/<kitId>.css" />`. Without it, Thai falls back to Sarabun.

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
