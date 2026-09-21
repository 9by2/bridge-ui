# Package Hygiene Contract

**Status:** accepted

Published `@bridge/ui` CSS is emitted by StyleX and the package component CSS
entry without Tailwind transformation. Tailwind remains a private catalog tool
for generated reference source. Packaged root, stable direct, and compatible
wildcard exports resolve with declarations from an isolated Bun-installed
tarball. Current documentation describes verified package behavior rather than
volatile hand-maintained inventory counts.
