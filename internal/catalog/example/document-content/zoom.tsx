import { contractContent } from "@catalog-prototype/shared/document-content"

import { DocumentContent, DocumentPage, DocumentPageSize } from "@bridge/ui"

const Zoom = [0.5, 0.75, 1] as const

export default function Example() {
  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        overflow: "auto",
        padding: 24,
        backgroundColor: "#1b1b20"
      }}>
      {Zoom.map((zoom) => (
        <DocumentPage key={zoom} size={DocumentPageSize.A4} zoom={zoom} aria-label={`A4 at ${zoom * 100}%`}>
          <DocumentContent content={contractContent} />
        </DocumentPage>
      ))}
    </div>
  )
}
