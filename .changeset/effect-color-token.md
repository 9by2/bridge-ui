---
"@bridge/ui": minor
---

Add effect color tokens so overlays and elevation follow the theme.

- `--bridge-color-backdrop` tints Dialog, AlertDialog, Sheet and Drawer backdrops; `Theme` accepts `theme.color.backdrop`.
- `--bridge-color-shadow` colors every owned elevation shadow; `Theme` accepts `theme.color.shadow`.
- `--bridge-color-scrollbar` / `--bridge-color-scrollbar-hover` color the Cue scrollbar.
- Colored all-day `BridgeCalendar` events pick black or white text from the event color instead of fixed white.

Defaults render unchanged.
- Generated Shadcn reference: backdrops use `bg-overlay` and the slider thumb uses `bg-background` (refreshed through the guarded Shadcn CLI script); catalog Tailwind shadows follow `--bridge-color-shadow`.
