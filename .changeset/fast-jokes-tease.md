---
"@bridge/ui": minor
---

Add a QrCode primitive wrapping `react-qr-code` with brand-safe transparent/currentColor defaults, and correct TicketCover to a border-free, chrome-free, notch-masked image frame with a full-bleed covering image.

Also ships every unreleased fix since 0.4.0, all part of the Cue UI decoupling work:

- Removed the live global square-radius `!important` override from `adapter.css`. It was still shipping into `dist/style.css`, forcing Card/Dialog/DropArea and other rounded Cue-recipe surfaces to 0px. Components that legitimately need square/pill shape already self-declare it in their own StyleX source.
- Added `token.brandText`, a WCAG-AA-safe pairing for the brand fill color, fixing a real axe color-contrast violation on the Tabs link active-trigger.
- Fixed Receipt's `dl`/`div` axe definition-list violation: `ReceiptDetail` now renders outside the `dl` instead of as an invalid direct child.
- Added a real fourth Theme mode (`future`) with its own semantic palette, plus DOM/geometry parity tests proving all four themes share identical non-color geometry.
- Fixed `SonnerToaster`, which read `next-themes`' `useTheme()` instead of the package's own `Theme`. Added a public `useThemeMode()` hook and rewired Sonner to map light->light and dark/cue/future->dark. Removed the now-unused `next-themes` dependency.
- Added stable direct package exports for Calendar, Dialog, Tabs, and Select (previously only Button had one).
- Added mobile/dark/reduced-motion/long-copy/Thai-copy state coverage for the 10 Phase 3 branded families (Receipt, StatusStamp, DetailItem, SettingItem, StickyAlert, SuccessBurst, ResponsiveImage, ProductItem/QuantityStepper, TicketCover, TicketCard), fixing a real bug where ProductItem's example made QuantityStepper's disabled-at-bounds state unreachable.
