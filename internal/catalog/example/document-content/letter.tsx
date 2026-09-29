import { contractContent } from "@catalog-prototype/shared/document-content"

import { DocumentContent, DocumentPage, DocumentPageSize } from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ overflow: "auto", padding: 24, backgroundColor: "#1b1b20" }}>
      <DocumentPage
        size={DocumentPageSize.Letter}
        zoom={0.75}
        margin={{ top: 72, right: 72, bottom: 72, left: 72 }}
        contentMargin={{ top: 12, bottom: 12 }}
        header={
          <>
            <span>Bridge Co., Ltd.</span>
            <span>Employment Agreement</span>
          </>
        }
        footer={
          <>
            <span>Confidential</span>
            <span>Page 1</span>
          </>
        }
        headerHeight={24}
        footerHeight={24}
        aria-label="Letter contract preview">
        <DocumentContent content={contractContent} fontSize={14} lineHeight={1.5} />
      </DocumentPage>
    </div>
  )
}
