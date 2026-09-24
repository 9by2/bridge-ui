---
"@bridge/ui": minor
---

Add the prose typography set, `ResponsiveImage` resilience, `ShellHeader` action injection and small exports.

- Typography: `Blockquote`, `InlineCode`, `List` (`ordered`), `Lead`, `Muted`, `Small`, `Large` from the root and `@bridge/ui/typography`. Prose tables reuse `Table`.
- `ResponsiveImage` `fallbackSrc` (swaps once, no loop) and `placeholder={{ blurDataUrl }}`.
- `ShellHeaderActionProvider`, `useShellHeaderAction(node)` and `ShellHeaderActionSlot`.
- `DateRange` and `Matcher` types next to `Calendar`; `Crop`, `PercentCrop` and `PixelCrop` types next to `ImageCrop`; `MultiSelectSeparator`.
