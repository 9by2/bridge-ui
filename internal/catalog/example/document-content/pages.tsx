import { contractContent } from "@catalog-prototype/shared/document-content"

import { DocumentContent, DocumentPage, DocumentPageSize, splitDocumentPages } from "@bridge/ui"

// One frame per page break, matching the per-page PDF HTML. Printing this route yields one PDF page per frame.
export default function Example() {
  const pages = splitDocumentPages(contractContent).map((content, index) => ({ id: `page-${index + 1}`, content }))
  return (
    <div style={{ display: "grid", gap: 24, overflow: "auto", padding: 24, backgroundColor: "#1b1b20" }}>
      {pages.map((page, index) => (
        <DocumentPage
          key={page.id}
          size={DocumentPageSize.A4}
          zoom={0.5}
          footer={
            <span>
              Page {index + 1} of {pages.length}
            </span>
          }
          aria-label={`Page ${index + 1}`}>
          <DocumentContent content={page.content} />
        </DocumentPage>
      ))}
    </div>
  )
}
