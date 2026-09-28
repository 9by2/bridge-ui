---
"@bridge/ui": patch
---

Make catalog examples render exactly as consumers see them. The catalog now uses the consumer cascade (Tailwind utilities before package StyleX), and examples no longer restyle package parts. Sidebar and DropdownMenu text use the root-relative `--bridge-text-size-*` scale (menu buttons were 12.25px when nested, now 14px), sidebar and group labels stay on one line with ellipsis, static `Sidebar collapsible="none"` fills its row height, and `DropdownMenuContent` fits long items up to 20rem instead of the trigger width. Add `PaginationLink activeVariant` (`PaginationActiveVariant`) and `Empty variant` (`EmptyVariant`).
