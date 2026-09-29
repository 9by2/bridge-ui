---
"@bridge/ui": patch
---

Fix the `VideoPlayer` play icon disappearing in dark theme (white glyph on white `primary`). The icon now uses the `primary` / `primaryForeground` token pair with a `primaryForeground` ring, so it stays visible over bright and dark posters in every theme. RichContent `video` nodes inherit the fix.
