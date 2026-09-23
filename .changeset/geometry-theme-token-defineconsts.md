---
"@bridge/ui": patch
---

Fixed `geometryToken` and `themeToken` in `token.stylex.ts`: both were plain JS object literals whose identical string values repeated across files (Button, Input, Textarea, Kanban, Dialog, Popover, Card, MetricTile, and more). The StyleX compiler folded these repeated literals into a shared internal CSS custom property but silently dropped its `:root` definition, so every consumer resolved `var(--xHASH)` to nothing — most visibly Button's border-radius rendering as `0px` with no inline padding in every Theme mode, including Cue. Both tokens now use `stylex.defineConsts()`, StyleX's documented API for cross-file shared constants, which emits the definition it references.
