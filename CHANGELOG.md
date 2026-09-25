# @bridge/ui

## 0.12.0

### Minor Changes

- d09b41b: Close the remaining consumer replacement gaps for file preview, uploads, multi-select and combobox chips.

  - `UploadViewer` adds `status` (`UploadViewerStatus`: `loading`, `ready`, `error`; default `ready`), `statusLabel` and a caller-owned `action` slot. `source.url` is now optional until the file is ready. PDF fallback copy appears only on `status="error"`, not under a working preview. Download and the action appear only when the file is viewable.
  - `UploadList` adds `preview` (`UploadListPreview`: `none`, `row`, `thumbnail`). `none` hides items while selection, validation and callbacks keep running. `thumbnail` renders square tiles in the grid track. If you omit it, behavior is unchanged. CUSTOMIZATION.md documents the raw `DropArea` and controlled `UploadList` recipes for custom surfaces.
  - `MultiSelectTrigger` adds `width` (`MultiSelectTriggerWidth`: `intrinsic` by default, or `full`) to fill a form row.
  - `ComboboxChip` adds `removeLabel`, which names each remove button. **Accessibility fix:** a chip without `removeLabel` no longer renders an unnamed icon-only remove button. Pass `removeLabel` wherever chips should stay removable.

## 0.11.0

### Minor Changes

- ced4acb: Add effect color tokens so overlays and elevation follow the theme.

  - `--bridge-color-backdrop` tints Dialog, AlertDialog, Sheet and Drawer backdrops; `Theme` accepts `theme.color.backdrop`.
  - `--bridge-color-shadow` colors every owned elevation shadow; `Theme` accepts `theme.color.shadow`.
  - `--bridge-color-scrollbar` / `--bridge-color-scrollbar-hover` color the Cue scrollbar.
  - Colored all-day `BridgeCalendar` events pick black or white text from the event color instead of fixed white.

  Defaults render unchanged.

  - Generated Shadcn reference: backdrops use `bg-overlay` and the slider thumb uses `bg-background` (refreshed through the guarded Shadcn CLI script); catalog Tailwind shadows follow `--bridge-color-shadow`.

### Patch Changes

- 5c14613: Stop text sizes compounding inside containers and bound SwimLaneBoard lane width.

  - New root-relative `--bridge-text-size-{xs,sm,md,base,lg}` tokens. `Body` (1rem), `Large`, `Muted`, `Small`, `Badge`, `StatusStamp`, `DetailItemLabel`, TimelineStep description/time, and WizardStep description/counter use them, so nested text never drops below 12px.
  - `SwimLaneBoardItem` uses the 0.875rem body size instead of `0.75em`; nested children keep their own size. Count badges and the corner label render at 12px.
  - `SwimLaneBoard` adds `columnMinWidth` / `columnMaxWidth` (default `min(18rem, 82vw)` / `20rem`). Expanded lanes no longer stretch to fill the board.

## 0.11.0-rc.0

### Minor Changes

- ced4acb: Add effect color tokens so overlays and elevation follow the theme.

  - `--bridge-color-backdrop` tints Dialog, AlertDialog, Sheet and Drawer backdrops; `Theme` accepts `theme.color.backdrop`.
  - `--bridge-color-shadow` colors every owned elevation shadow; `Theme` accepts `theme.color.shadow`.
  - `--bridge-color-scrollbar` / `--bridge-color-scrollbar-hover` color the Cue scrollbar.
  - Colored all-day `BridgeCalendar` events pick black or white text from the event color instead of fixed white.

  Defaults render unchanged.

  - Generated Shadcn reference: backdrops use `bg-overlay` and the slider thumb uses `bg-background` (refreshed through the guarded Shadcn CLI script); catalog Tailwind shadows follow `--bridge-color-shadow`.

### Patch Changes

- 5c14613: Stop text sizes compounding inside containers and bound SwimLaneBoard lane width.

  - New root-relative `--bridge-text-size-{xs,sm,md,base,lg}` tokens. `Body` (1rem), `Large`, `Muted`, `Small`, `Badge`, `StatusStamp`, `DetailItemLabel`, TimelineStep description/time, and WizardStep description/counter use them, so nested text never drops below 12px.
  - `SwimLaneBoardItem` uses the 0.875rem body size instead of `0.75em`; nested children keep their own size. Count badges and the corner label render at 12px.
  - `SwimLaneBoard` adds `columnMinWidth` / `columnMaxWidth` (default `min(18rem, 82vw)` / `20rem`). Expanded lanes no longer stretch to fill the board.

## 0.10.0

### Minor Changes

- 827c93b: Add `BridgeCalendar` event color, muted state, holiday render and month drag-hover.

  - `BridgeCalendarEvent` `color` (any CSS color, exposed as `--bridge-calendar-event-color`, overrides `tone`) and `muted`.
  - `BridgeCalendarHoliday` `meta` and `renderHoliday(holiday, { view, date })`.
  - Month days show a drop-target highlight (`data-drop-target`) while an external draggable is over them. It clears on leave, drop or `dragend`.
  - `onEventActivate` is documented as the mapping for both click and keyboard open.

- 1aa2d34: Add `Page` density, width, header slot and form action, and `DataState` retry.

  - `Page` `density` (`PageDensity`: `compact`, `default`, `comfortable`, `none`) is the canonical padding prop. `data-density` is added.
  - **Deprecated:** `Page` `spacing`. It stays a working alias with the same values; `density` wins when both are set, and `data-spacing` keeps emitting. Migrate `spacing="x"` → `density="x"`. Removal is planned for the next major.
  - `Page` `width` (`PageWidth`: `full`, `content` 80rem, `form` 48rem, `editor` edge-to-edge) controls max-width only.
  - New `PageEyebrow`, `PageMeta`, `PageFilter` header slots and `PageFormAction` (`align`, `sticky`).
  - `DataState` `onRetry` + `retryLabel` render a standard retry button.

- 02db9cd: Add the prose typography set, `ResponsiveImage` resilience, `ShellHeader` action injection and small exports.

  - Typography: `Blockquote`, `InlineCode`, `List` (`ordered`), `Lead`, `Muted`, `Small`, `Large` from the root and `@bridge/ui/typography`. Prose tables reuse `Table`.
  - `ResponsiveImage` `fallbackSrc` (swaps once, no loop) and `placeholder={{ blurDataUrl }}`.
  - `ShellHeaderActionProvider`, `useShellHeaderAction(node)` and `ShellHeaderActionSlot`.
  - `DateRange` and `Matcher` types next to `Calendar`; `Crop`, `PercentCrop` and `PixelCrop` types next to `ImageCrop`; `MultiSelectSeparator`.

- b6f7a59: Add `RateCard`, a compound presentation for priced offers with required `variants` (`row` for managed rate lists, `card` for bookable services, `plan` for comparable tiers, `inline` for a frameless phrasing summary inside a Select trigger or item) and optional `highlight`. Parts cover title, highlight ribbon, description, price with prefix and period, detail list, feature list and action slot. Available from the root and `@bridge/ui/rate-card`.
- 896326f: Add Sonner imperative export and `Spinner` size.

  - Root `sonnerToast` and `@bridge/ui/sonner` subpath (`Toaster`, `toast`) share the package Sonner instance with `SonnerToaster`. The Base UI `toast` export is unchanged; JSDoc on both names its paired toaster.
  - `Spinner` accepts `size` (`SpinnerSize`: `sm`, `default`, `lg`); default render is unchanged. New `@bridge/ui/spinner` subpath.

- 1b56777: Add composable upload validation and issue reporting to `UploadList`.

  - `validate` with `uploadValidation.default/accept/extension` and `composeUploadValidation`; `UploadIssue` with `UploadIssueCode`.
  - `onValueChange(value, change)` now receives `{ reason, attachment }` (`UploadChangeReason`: `append`, `replace`, `remove`, `clear`). Existing one-argument callbacks keep working.
  - `onIssue(issue, { accepted, rejected })` reports every issue. Optional `issueDisplay="inline"` renders an accessible `role="alert"` list. Upload components never toast.
  - `layout` (`UploadListLayout`: `list`, `grid`), `renderEmpty`, `renderItem`, and single-file replace through `multiple={false}`.
  - `UploadPreview` `variant` (`UploadPreviewVariant`: `row`, `tile`).
  - **Deprecated:** `UploadList` `onReject`. Use `onIssue`; `onReject` still fires unchanged.

### Patch Changes

- e916850: Size consumer icons without intrinsic dimensions in every icon slot.

  An inline SVG with only a `viewBox` (e.g. a consumer brand mark) no longer fills its host box in `MetricTile` `icon` (now 18px), `DataStateMedia` (24px), `EmptyMedia variant="icon"` (16px) or `SettingsNavItem` (16px + 8px gap). Icons with an explicit size (lucide `size`, `size-*` class) are unchanged.

- 1f50a36: Document the Typography heading font stack for mixed Thai/English content: Latin renders in Plus Jakarta Sans and Thai in `aktiv-grotesk`, which consumers load through their own Adobe Fonts kit (Sarabun remains the fallback). The catalog now loads the Adobe Fonts kit and its Typography example mixes Thai and English.

## 0.10.0-rc.0

### Minor Changes

- 827c93b: Add `BridgeCalendar` event color, muted state, holiday render and month drag-hover.

  - `BridgeCalendarEvent` `color` (any CSS color, exposed as `--bridge-calendar-event-color`, overrides `tone`) and `muted`.
  - `BridgeCalendarHoliday` `meta` and `renderHoliday(holiday, { view, date })`.
  - Month days show a drop-target highlight (`data-drop-target`) while an external draggable is over them. It clears on leave, drop or `dragend`.
  - `onEventActivate` is documented as the mapping for both click and keyboard open.

- 1aa2d34: Add `Page` density, width, header slot and form action, and `DataState` retry.

  - `Page` `density` (`PageDensity`: `compact`, `default`, `comfortable`, `none`) is the canonical padding prop. `data-density` is added.
  - **Deprecated:** `Page` `spacing`. It stays a working alias with the same values; `density` wins when both are set, and `data-spacing` keeps emitting. Migrate `spacing="x"` → `density="x"`. Removal is planned for the next major.
  - `Page` `width` (`PageWidth`: `full`, `content` 80rem, `form` 48rem, `editor` edge-to-edge) controls max-width only.
  - New `PageEyebrow`, `PageMeta`, `PageFilter` header slots and `PageFormAction` (`align`, `sticky`).
  - `DataState` `onRetry` + `retryLabel` render a standard retry button.

- 02db9cd: Add the prose typography set, `ResponsiveImage` resilience, `ShellHeader` action injection and small exports.

  - Typography: `Blockquote`, `InlineCode`, `List` (`ordered`), `Lead`, `Muted`, `Small`, `Large` from the root and `@bridge/ui/typography`. Prose tables reuse `Table`.
  - `ResponsiveImage` `fallbackSrc` (swaps once, no loop) and `placeholder={{ blurDataUrl }}`.
  - `ShellHeaderActionProvider`, `useShellHeaderAction(node)` and `ShellHeaderActionSlot`.
  - `DateRange` and `Matcher` types next to `Calendar`; `Crop`, `PercentCrop` and `PixelCrop` types next to `ImageCrop`; `MultiSelectSeparator`.

- b6f7a59: Add `RateCard`, a compound presentation for priced offers with required `variants` (`row` for managed rate lists, `card` for bookable services, `plan` for comparable tiers, `inline` for a frameless phrasing summary inside a Select trigger or item) and optional `highlight`. Parts cover title, highlight ribbon, description, price with prefix and period, detail list, feature list and action slot. Available from the root and `@bridge/ui/rate-card`.
- 896326f: Add Sonner imperative export and `Spinner` size.

  - Root `sonnerToast` and `@bridge/ui/sonner` subpath (`Toaster`, `toast`) share the package Sonner instance with `SonnerToaster`. The Base UI `toast` export is unchanged; JSDoc on both names its paired toaster.
  - `Spinner` accepts `size` (`SpinnerSize`: `sm`, `default`, `lg`); default render is unchanged. New `@bridge/ui/spinner` subpath.

- 1b56777: Add composable upload validation and issue reporting to `UploadList`.

  - `validate` with `uploadValidation.default/accept/extension` and `composeUploadValidation`; `UploadIssue` with `UploadIssueCode`.
  - `onValueChange(value, change)` now receives `{ reason, attachment }` (`UploadChangeReason`: `append`, `replace`, `remove`, `clear`). Existing one-argument callbacks keep working.
  - `onIssue(issue, { accepted, rejected })` reports every issue. Optional `issueDisplay="inline"` renders an accessible `role="alert"` list. Upload components never toast.
  - `layout` (`UploadListLayout`: `list`, `grid`), `renderEmpty`, `renderItem`, and single-file replace through `multiple={false}`.
  - `UploadPreview` `variant` (`UploadPreviewVariant`: `row`, `tile`).
  - **Deprecated:** `UploadList` `onReject`. Use `onIssue`; `onReject` still fires unchanged.

### Patch Changes

- e916850: Size consumer icons without intrinsic dimensions in every icon slot.

  An inline SVG with only a `viewBox` (e.g. a consumer brand mark) no longer fills its host box in `MetricTile` `icon` (now 18px), `DataStateMedia` (24px), `EmptyMedia variant="icon"` (16px) or `SettingsNavItem` (16px + 8px gap). Icons with an explicit size (lucide `size`, `size-*` class) are unchanged.

- 1f50a36: Document the Typography heading font stack for mixed Thai/English content: Latin renders in Plus Jakarta Sans and Thai in `aktiv-grotesk`, which consumers load through their own Adobe Fonts kit (Sarabun remains the fallback). The catalog now loads the Adobe Fonts kit and its Typography example mixes Thai and English.

## 0.9.0-rc.3

### Minor Changes

- 827c93b: Add `BridgeCalendar` event color, muted state, holiday render and month drag-hover.

  - `BridgeCalendarEvent` `color` (any CSS color, exposed as `--bridge-calendar-event-color`, overrides `tone`) and `muted`.
  - `BridgeCalendarHoliday` `meta` and `renderHoliday(holiday, { view, date })`.
  - Month days show a drop-target highlight (`data-drop-target`) while an external draggable is over them. It clears on leave, drop or `dragend`.
  - `onEventActivate` is documented as the mapping for both click and keyboard open.

- 1aa2d34: Add `Page` density, width, header slot and form action, and `DataState` retry.

  - `Page` `density` (`PageDensity`: `compact`, `default`, `comfortable`, `none`) is the canonical padding prop. `data-density` is added.
  - **Deprecated:** `Page` `spacing`. It stays a working alias with the same values; `density` wins when both are set, and `data-spacing` keeps emitting. Migrate `spacing="x"` → `density="x"`. Removal is planned for the next major.
  - `Page` `width` (`PageWidth`: `full`, `content` 80rem, `form` 48rem, `editor` edge-to-edge) controls max-width only.
  - New `PageEyebrow`, `PageMeta`, `PageFilter` header slots and `PageFormAction` (`align`, `sticky`).
  - `DataState` `onRetry` + `retryLabel` render a standard retry button.

- 02db9cd: Add the prose typography set, `ResponsiveImage` resilience, `ShellHeader` action injection and small exports.

  - Typography: `Blockquote`, `InlineCode`, `List` (`ordered`), `Lead`, `Muted`, `Small`, `Large` from the root and `@bridge/ui/typography`. Prose tables reuse `Table`.
  - `ResponsiveImage` `fallbackSrc` (swaps once, no loop) and `placeholder={{ blurDataUrl }}`.
  - `ShellHeaderActionProvider`, `useShellHeaderAction(node)` and `ShellHeaderActionSlot`.
  - `DateRange` and `Matcher` types next to `Calendar`; `Crop`, `PercentCrop` and `PixelCrop` types next to `ImageCrop`; `MultiSelectSeparator`.

- 896326f: Add Sonner imperative export and `Spinner` size.

  - Root `sonnerToast` and `@bridge/ui/sonner` subpath (`Toaster`, `toast`) share the package Sonner instance with `SonnerToaster`. The Base UI `toast` export is unchanged; JSDoc on both names its paired toaster.
  - `Spinner` accepts `size` (`SpinnerSize`: `sm`, `default`, `lg`); default render is unchanged. New `@bridge/ui/spinner` subpath.

- 1b56777: Add composable upload validation and issue reporting to `UploadList`.

  - `validate` with `uploadValidation.default/accept/extension` and `composeUploadValidation`; `UploadIssue` with `UploadIssueCode`.
  - `onValueChange(value, change)` now receives `{ reason, attachment }` (`UploadChangeReason`: `append`, `replace`, `remove`, `clear`). Existing one-argument callbacks keep working.
  - `onIssue(issue, { accepted, rejected })` reports every issue. Optional `issueDisplay="inline"` renders an accessible `role="alert"` list. Upload components never toast.
  - `layout` (`UploadListLayout`: `list`, `grid`), `renderEmpty`, `renderItem`, and single-file replace through `multiple={false}`.
  - `UploadPreview` `variant` (`UploadPreviewVariant`: `row`, `tile`).
  - **Deprecated:** `UploadList` `onReject`. Use `onIssue`; `onReject` still fires unchanged.

### Patch Changes

- e916850: Size consumer icons without intrinsic dimensions in every icon slot.

  An inline SVG with only a `viewBox` (e.g. a consumer brand mark) no longer fills its host box in `MetricTile` `icon` (now 18px), `DataStateMedia` (24px), `EmptyMedia variant="icon"` (16px) or `SettingsNavItem` (16px + 8px gap). Icons with an explicit size (lucide `size`, `size-*` class) are unchanged.

## 0.9.0-rc.2

### Minor Changes

- b6f7a59: Add `RateCard`, a compound presentation for priced offers with required `variants` (`row` for managed rate lists, `card` for bookable services, `plan` for comparable tiers, `inline` for a frameless phrasing summary inside a Select trigger or item) and optional `highlight`. Parts cover title, highlight ribbon, description, price with prefix and period, detail list, feature list and action slot. Available from the root and `@bridge/ui/rate-card`.

## 0.9.0-rc.1

### Patch Changes

- 1f50a36: Document the Typography heading font stack for mixed Thai/English content: Latin renders in Plus Jakarta Sans and Thai in `aktiv-grotesk`, which consumers load through their own Adobe Fonts kit (Sarabun remains the fallback). The catalog now loads the Adobe Fonts kit and its Typography example mixes Thai and English.

## 0.9.0-rc.0

### Minor Changes

- ad536ec: Add ColorPicker. The composing layer declares a required `mode` (`fill` | `gradient`) and, for gradients, a required `kind` (`linear` | `radial` | `conic`). Includes injectable system presets (`colorPickerPreset.fill`, `colorPickerGradientPreset(kind)`), a custom editor (hex for fill; angle or shape, repeating and positioned stops for gradient) that emits the CSS string with a `colorPickerParse` round-trip, and `size` / `layout` variants.

## 0.8.1

### Patch Changes

- 0700a61: Documented the switch to a PR-based workflow in `AGENTS.md`: work now happens on a non-`main` branch merged via pull/merge request instead of direct pushes to `main`. Added explicit commit-title (`{{type}}({{detail}}): {{short-message}}`) and branch-name (`{{type}}/{{detail}}`) patterns. The automated release branch remains automation-owned. No runtime behavior changes; this changeset exists to exercise the PR-triggered release pipeline end to end.

## 0.8.0

### Minor Changes

- 7faa682: Expose stable CSS override names for the brand palette in statically compiled component recipes.
- 91c3edc: Add theme-aware MetricTile with required featured, standard and compact variants.
- 7faa682: Derive owned StyleX palette, typography, and shape styling from shared theme variables instead of component-specific CSS variables while retaining semantic component props.

### Patch Changes

- c0df720: Source Cue Input's default control radius from the published stylesheet rather than an inline Theme default.
- b809b3c: Use an em-based Cue control radius and standalone Input fallback while preserving Theme overrides.
- 045bdd8: Restore Input's theme control-radius variable and match Cue's 8px control radius in Cue mode.
- ed7cf26: Use relative em units for shared theme typography and radius scales.
- 7faa682: Keep the accessible static image fallback when a FractalGlass WebGL texture request fails.
- 4e0688f: Fixed `geometryToken` and `themeToken` in `token.stylex.ts`: both were plain JS object literals whose identical string values repeated across files (Button, Input, Textarea, Kanban, Dialog, Popover, Card, MetricTile, and more). The StyleX compiler folded these repeated literals into a shared internal CSS custom property but silently dropped its `:root` definition, so every consumer resolved `var(--xHASH)` to nothing — most visibly Button's border-radius rendering as `0px` with no inline padding in every Theme mode, including Cue. Both tokens now use `stylex.defineConsts()`, StyleX's documented API for cross-file shared constants, which emits the definition it references.
- 9812868: Keep Kanban drag handlers aligned with committed props and preserve hook order across overlay rendering.
- 35bef60: Improve owned component context stability and breadcrumb accessibility while retaining existing component APIs.

## 0.7.0

### Minor Changes

- 91eddf7: Add the reusable BridgeCalendar schedule component with scheduled, week, and month views.
- 1025a96: Add independent Dialog background and foreground theme colors.
- 5754b5c: Add a StyleX Kanban compound component with controlled item and column reordering.
- ce5cf7f: Make Page full-width by default and add the explicit container layout variant.
- ba9083d: Add the `SettingItem` inline presentation variant.
- 2576ee3: Add responsive settings composition with sidebar identity header and catalog action patterns.
- 69c4d6c: Add a theme-aware SwimLaneBoard compound component for Kanban and Scrum workflows.
- 7287e2e: Add scoped custom theme colors, shared radius, spacing, and density overrides for P0 owned component families.

### Patch Changes

- d2d5a37: Document custom Breadcrumb separator content in the component catalog.
- d2d5a37: Add a Breadcrumb catalog gallery for custom separator content.
- a0d8fd5: Fix BridgeCalendar month-grid accessibility and packaged React 19 declaration verification.
- 8a7f7dd: Add configurable Card border-radius variants.
- fd0eca3: Reduce the catalog startup bundle and enforce catalog asset budgets.
- 7bc99f9: Fix avatar fallback text contrast and stabilize parallel catalog verification.
- 5153035: Add semantic component variants, ReactCrop-compatible image selection, framed Table composition, and expanded catalog examples. Repair responsive crop composition, framed table sizing, and Calendar range/today presentation.
- a58cf0c: Restore runtime coverage and full catalog verification gates.
- b234bed: Restore Cue-derived primary Button defaults after StyleX compilation.
- 1025a96: Restore Cue-derived default recipes for core controls and status/navigation components while retaining Bridge extensions.
- 27faab6: Add Cue-compatible semantic typography primitives.
- 194fbe2: Fix Dialog footer padding at compact and comfortable density.
- 0b2c5cd: Add a decorative leading icon option to Input.
- 3235e52: Reduce the default Page title scale for a denser layout hierarchy.
- ec18139: Add opt-in, side-aware native resizing for SheetContent.
- f73c176: Remove the catalog's separate normal example mode so every preview uses the public StyleX implementation.
- bb5ff06: Fix SwimLaneBoard pointer and keyboard movement across whole-cell drop zones, add stable drag overlays, and highlight valid cells during drag.
- 5dbb9dd: Give tab lists an opaque background for readable sticky overlays.

## 0.6.2

### Patch Changes

- ff2fa70: Keep horizontal line Tab triggers square-edged.

## 0.6.1

### Patch Changes

- 7344ef3: Build published CSS without Tailwind processing and remove redundant package-build dependency.
- 599de30: Tighten WizardStep line segments and add spacing between them.

## 0.6.0

### Minor Changes

- d1bf765: Add `FlipText`, a Unicode-safe StyleX animated text presentation component with configurable timing and reduced-motion support.
- 6a8e23a: Add `FractalGlass`, a shader-driven refracted image and video presentation component with accessible static fallback and reduced-motion support.
- 31b7444: Add a `WizardStep` reusable StyleX presentation family (`WizardStep`, `WizardStepItem`, `WizardStepIndicator`, `WizardStepConnector`, `WizardStepLabel`, `WizardStepTitle`, `WizardStepDescription`, `WizardStepCounter`) for multi-step wizard headers, distinct from the existing content-feed-oriented `TimelineStep`. Supports `horizontal`/`vertical` orientation, `number`/`dot`/`line` variant, `hard`/`soft` tone, and an `upcoming`/`current`/`completed`/`error` state grammar with a completed-step `render` override for click-to-revisit interactivity.

### Patch Changes

- f7b22b3: Require the consumer's Recharts v3 runtime for ChartContainer composition.

## 0.5.0

### Minor Changes

- a157f9d: Add a QrCode primitive wrapping `react-qr-code` with brand-safe transparent/currentColor defaults, and correct TicketCover to a border-free, chrome-free, notch-masked image frame with a full-bleed covering image.

  Also ships every unreleased fix since 0.4.0, all part of the Cue UI decoupling work:

  - Removed the live global square-radius `!important` override from `adapter.css`. It was still shipping into `dist/style.css`, forcing Card/Dialog/DropArea and other rounded Cue-recipe surfaces to 0px. Components that legitimately need square/pill shape already self-declare it in their own StyleX source.
  - Added `token.brandText`, a WCAG-AA-safe pairing for the brand fill color, fixing a real axe color-contrast violation on the Tabs link active-trigger.
  - Fixed Receipt's `dl`/`div` axe definition-list violation: `ReceiptDetail` now renders outside the `dl` instead of as an invalid direct child.
  - Added a real fourth Theme mode (`future`) with its own semantic palette, plus DOM/geometry parity tests proving all four themes share identical non-color geometry.
  - Fixed `SonnerToaster`, which read `next-themes`' `useTheme()` instead of the package's own `Theme`. Added a public `useThemeMode()` hook and rewired Sonner to map light->light and dark/cue/future->dark. Removed the now-unused `next-themes` dependency.
  - Added stable direct package exports for Calendar, Dialog, Tabs, and Select (previously only Button had one).
  - Added mobile/dark/reduced-motion/long-copy/Thai-copy state coverage for the 10 Phase 3 branded families (Receipt, StatusStamp, DetailItem, SettingItem, StickyAlert, SuccessBurst, ResponsiveImage, ProductItem/QuantityStepper, TicketCover, TicketCard), fixing a real bug where ProductItem's example made QuantityStepper's disabled-at-bounds state unreachable.
  - Replaced the Playwright catalog browser test suite with a hand-rolled `bun:test` + `Bun.WebView` harness (`test/browser/support/`); removed `playwright`, `@playwright/test`, and `@axe-core/playwright` devDependencies entirely. No public API or published package change; internal-only, covered by the existing 522-case `bun catalog:test` browser gate now running through `cmd/run-catalog-test.ts`.

## 0.4.0

### Minor Changes

- 4310bd0: Add reusable StyleX data state, table frame, timeline step, and page toolbar presentation contracts.

## 0.3.0

### Minor Changes

- e04b32a: Add an explicit Cue theme with branded, warning, destructive, status, typography, surface, and native browser style alignment.
- e04b32a: Refine Tabs with borderless default trigger, primary line navigation, and active-only capsule option.
- 697b9bb: Add compact sticky shell header primitives, correct SidebarInset shrinking beside a collapsible sidebar, and keep Avatar surfaces circular.

## 0.3.0-rc.0

### Minor Changes

- e04b32a: Add an explicit Cue theme with branded, warning, destructive, status, typography, surface, and native browser style alignment.
- e04b32a: Refine Tabs with borderless default trigger, primary line navigation, and active-only capsule option.
- 697b9bb: Add compact sticky shell header primitives, correct SidebarInset shrinking beside a collapsible sidebar, and keep Avatar surfaces circular.

## 0.2.0

### Minor Changes

- 2ecbbae: Add responsive StyleX Page layout slot for breadcrumb, heading, description, action, and content composition.
- 5665ff9: Promote the complete StyleX component implementation to public root, direct, generated-compatible and brand-compatible package paths. Package precompiled component CSS and the scoped engine adapter without requiring consumer Tailwind or StyleX compilation.

### Patch Changes

- 7150c06: Emit production-compatible JSX so package component renders with production React. Execute packed SSR output during release verification instead of checking compilation alone.
- b1c984e: Automate reviewed Changesets release MR publication for RC and stable version on protected main, with isolated registry verification and post-publication Git tag creation.
- 5665ff9: Correct light-theme secondary foreground contrast against its dark background. Preserve dark-theme styling and generated component behavior.
- 5adb4e7: Use square corners for every component slot and component pseudo-element.
- 27de364: Serialize StyleX Bun transform callbacks so concurrent stylesheet writes cannot drop compiled token or component CSS. Preserve the official compiler and precompiled consumer contract.

## 0.2.0-rc.3

### Minor Changes

- 2ecbbae: Add responsive StyleX Page layout slot for breadcrumb, heading, description, action, and content composition.

### Patch Changes

- 5adb4e7: Use square corners for every component slot and component pseudo-element.

## 0.2.0-rc.2

### Minor Changes

- 5665ff9: Promote the complete StyleX component implementation to public root, direct, generated-compatible and brand-compatible package paths. Package precompiled component CSS and the scoped engine adapter without requiring consumer Tailwind or StyleX compilation.

### Patch Changes

- 5665ff9: Correct light-theme secondary foreground contrast against its dark background. Preserve dark-theme styling and generated component behavior.
- 27de364: Serialize StyleX Bun transform callbacks so concurrent stylesheet writes cannot drop compiled token or component CSS. Preserve the official compiler and precompiled consumer contract.

## 0.1.1-rc.1

### Patch Changes

- 7150c06: Emit production-compatible JSX so package component renders with production React. Execute packed SSR output during release verification instead of checking compilation alone.

## 0.1.1-rc.0

### Patch Changes

- b1c984e: Automate reviewed Changesets release MR publication for RC and stable version on protected main, with isolated registry verification and post-publication Git tag creation.

## 0.1.0

### Minor Changes

- Separate package runtime coverage from command and catalog verification. Retain the 90% runtime floor and 100% brand floor, add mobile hook lifecycle verification, and keep command, packed package and browser verification mandatory in CI.
