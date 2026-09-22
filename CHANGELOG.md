# @bridge/ui

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
