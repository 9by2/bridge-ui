import { contractContent } from "@catalog-prototype/shared/document-content"

import { DocumentContent, DocumentPage, DocumentPageSize } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ overflow: "auto", padding: 24, backgroundColor: "#1b1b20" }}>
      <DocumentPage size={DocumentPageSize.A4} zoom={0.75} aria-label="Contract preview">
        <DocumentContent content={contractContent} fontSize={12} lineHeight={1.3} />
      </DocumentPage>
    </div>
  )
}
