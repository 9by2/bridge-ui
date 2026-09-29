# Design: Rich Content Document

```
stylex-support/rich-content-node.ts  (types, constants, sanitizers; shared)
  ├─ rich-content.tsx      themed, Typography-composed, interactive
  └─ document-content.tsx  DocumentContent, DocumentPage, splitDocumentPages, DocumentPageSize
```

```tsx
import { DocumentContent, DocumentPage, DocumentPageSize, splitDocumentPages } from "@bridge/ui/document-content"

// Preview
;<DocumentPage size={DocumentPageSize.A4} margin={{ top: 48, right: 48, bottom: 48, left: 48 }} zoom={0.75}>
  <DocumentContent content={nodes} fontSize={12} lineHeight={1.3} fontFamily="Inter, sans-serif" />
</DocumentPage>

// PDF (server)
const pages = splitDocumentPages(nodes).map((page) =>
  renderToStaticMarkup(<DocumentContent content={page} fontSize={12} lineHeight={1.3} />)
)
```
