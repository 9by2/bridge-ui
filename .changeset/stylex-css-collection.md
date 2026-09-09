---
"@bridge/ui": patch
---

Serialize StyleX Bun transform callbacks so concurrent stylesheet writes cannot drop compiled token or component CSS. Preserve the official compiler and precompiled consumer contract.
