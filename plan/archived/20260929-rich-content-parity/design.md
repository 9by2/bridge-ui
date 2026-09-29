# Design: Rich Content Parity

## Overview

Extend the existing allowlist renderer with a node-type dispatch table. Inline and block content use separate fields (`children` / `blocks`) so no shape sniffing is needed. Nested rendering carries a depth-limited context holding labels, image slot and clipboard writer.

## Components

| Component                      | Responsibility                      | Location                                          |
| ------------------------------ | ----------------------------------- | ------------------------------------------------- |
| RichContent                    | Validate and render typed nodes     | `app/component/brand/stylex/rich-content.tsx`     |
| ResponsiveImage                | Default image with sourceSet + blur | `app/component/brand/stylex/responsive-image.tsx` |
| VideoPlayer / YouTubeThumbnail | Deferred sandboxed YouTube embed    | existing                                          |

## Example Code

```tsx
// bridge-web mapper (app-owned)
const node: RichContentNode = {
  type: "table",
  columnWidths: [30, 70],
  rows: [{ cells: [{ header: true, children: [{ type: "text", text: "Name" }] }, { colSpan: 1, blocks: [...] }] }]
}
<RichContent content={[node]} labels={{ copyCode: t("copy") }} renderImage={(image) => <BridgeImage {...image} />} />
```

## Risks & Mitigations

| Risk                                        | Mitigation                                                 |
| ------------------------------------------- | ---------------------------------------------------------- |
| StyleX `var()` border shorthand drops width | Longhand border properties (found in browser verification) |
| Deep nesting stack overflow                 | Depth limit 24                                             |
| CSS injection via blur URL                  | Pattern allowlist; quotes/parens rejected                  |
