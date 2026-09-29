import { cleanup, render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it } from "vitest"

import {
  DocumentContent,
  DocumentPage,
  DocumentPageSize,
  documentStyleSheet,
  splitDocumentPages,
  type RichContentNode
} from "../../app/index"

afterEach(cleanup)

const text = (value: string, mark: Record<string, unknown> = {}) => ({ type: "text" as const, text: value, ...mark })

const document: RichContentNode[] = [
  { type: "heading", level: 1, align: "center", children: [text("Contract")] },
  { type: "paragraph", children: [text("Party "), text("A", { bold: true }), { type: "lineBreak" }, text("B")] },
  { type: "pageBreak" },
  {
    type: "table",
    columnWidths: [30, 70],
    rows: [
      {
        cells: [
          { header: true, children: [text("Name")] },
          { header: true, children: [text("Value")] }
        ]
      },
      { cells: [{ colSpan: 2, blocks: [{ type: "paragraph", children: [text("Merged")] }] }] }
    ]
  },
  { type: "image", src: "https://cdn.example/sign.png", alt: "Signature", align: "right", displayWidth: "30%" },
  { type: "image", src: "javascript:alert(1)", alt: "Unsafe" },
  { type: "video", embedUrl: "https://www.youtube.com/embed/abc", title: "Not printable" },
  { type: "codeBlock", code: "const a = 1" }
]

describe("DocumentContent static rendering", () => {
  // Protects: the PDF HTML and the browser preview come from one renderer; server markup equals client markup.
  it("renders the same markup on the server and the client", () => {
    const server = window.document.createElement("div")
    server.innerHTML = renderToStaticMarkup(<DocumentContent content={document} fontSize={12} lineHeight={1.3} />)
    const { container } = render(<DocumentContent content={document} fontSize={12} lineHeight={1.3} />)
    // Serialization order and inline-style spacing differ between React DOM and the server; compare the DOM.
    const normalize = (root: Element | null) => {
      for (const element of root?.querySelectorAll<HTMLElement>("[style]") ?? [])
        element.setAttribute("style", element.style.cssText)
      root?.setAttribute("style", (root as HTMLElement).style.cssText)
      return root
    }
    const client = normalize(container.querySelector('[data-slot="document-content"]'))
    expect(client).toBeTruthy()
    expect(normalize(server.querySelector('[data-slot="document-content"]'))?.isEqualNode(client)).toBe(true)
    expect(server.querySelector("style")?.textContent).toContain(".bridge-document")
  })

  // Protects: printable nodes survive, unsafe and non-printable nodes are dropped, print-critical attributes are set.
  it("keeps print semantics: page breaks, fixed table widths, aligned eager images, no embeds", () => {
    render(<DocumentContent content={document} labels={{ pageBreak: "แบ่งหน้า" }} />)
    expect(screen.getByRole("heading", { level: 1, name: "Contract" }).getAttribute("data-align")).toBe("center")
    expect(screen.getByRole("separator", { name: "แบ่งหน้า" }).getAttribute("data-slot")).toBe("document-page-break")
    const table = screen.getByRole("table")
    expect([...table.querySelectorAll("col")].map((col) => col.style.width)).toEqual(["30%", "70%"])
    expect(screen.getAllByRole("columnheader")).toHaveLength(2)
    expect(screen.getByRole("cell", { name: "Merged" }).getAttribute("colspan")).toBe("2")
    const image = screen.getByRole("img", { name: "Signature" })
    expect(image.getAttribute("loading")).toBe("eager")
    expect(image.style.width).toBe("30%")
    expect(image.closest("[data-slot='document-image']")?.getAttribute("data-align")).toBe("right")
    expect(screen.queryByRole("img", { name: "Unsafe" })).toBeNull()
    expect(screen.queryByRole("button")).toBeNull()
    expect(screen.queryByTitle("Not printable")).toBeNull()
    expect(screen.getByText("const a = 1").closest("pre")).toBeTruthy()
  })

  // Protects: callers own the base size so preview and PDF share one typographic scale.
  it("applies caller font settings and falls back when nothing renders", () => {
    const { container, rerender } = render(
      <DocumentContent content={document} fontSize={14} lineHeight={1.5} fontFamily="Sarabun, sans-serif" />
    )
    const root = container.querySelector<HTMLElement>('[data-slot="document-content"]')
    expect(root?.style.fontSize).toBe("14px")
    expect(root?.style.getPropertyValue("--document-line-height")).toBe("1.5")
    expect(root?.style.fontFamily).toBe("Sarabun, sans-serif")
    rerender(<DocumentContent content={[{ type: "video", embedUrl: "x", title: "x" }]} emptyFallback="Empty" />)
    expect(screen.getByText("Empty")).toBeTruthy()
  })

  // Protects: document output must not depend on the application theme.
  it("ships a theme-independent style sheet", () => {
    expect(documentStyleSheet).not.toContain("--bridge")
    expect(documentStyleSheet).toContain("break-after: page")
    expect(documentStyleSheet).toContain("break-inside: avoid")
  })
})

describe("DocumentContent node contract", () => {
  // Protects: the document renderer accepts the same node contract as RichContent, with the same URL safety.
  it("renders marks, safe links, lists, quotes and rules", () => {
    const { container } = render(
      <DocumentContent
        content={
          [
            {
              type: "paragraph",
              align: "justify",
              children: [
                text("b", { bold: true, italic: true, strike: true, underline: true, code: true }),
                text("site", { href: "https://example.org", external: true }),
                text("local", { href: "/terms" }),
                text("bad", { href: "javascript:alert(1)" })
              ]
            },
            { type: "heading", level: 7, children: [text("Invalid level")] },
            { type: "paragraph", children: [text("  ")] },
            { type: "list", ordered: false },
            {
              type: "table",
              rows: [{ cells: [{ header: true, children: [text("Row")] }, { children: [text("Data")] }] }]
            },
            {
              type: "list",
              ordered: true,
              start: 3,
              items: [[text("One")], { blocks: [{ type: "list", ordered: false, items: [[text("Nested")]] }] }, 5, []]
            },
            { type: "list", ordered: false, items: [] },
            { type: "quote", children: [text("Quoted")], blocks: [{ type: "paragraph", children: [text("More")] }] },
            { type: "quote", children: [] },
            { type: "horizontalRule" },
            { type: "break" },
            { type: "codeBlock", code: "  " },
            { type: "table", rows: [{ cells: [null] }, "row"] },
            { type: "table", rows: "none" },
            { type: "image", src: "/a.png", alt: 1 },
            null,
            { type: "unknown" },
            { type: "toString" }
          ] as unknown as RichContentNode[]
        }
      />
    )
    expect(container.querySelector("p")?.getAttribute("data-align")).toBe("justify")
    for (const tag of ["strong", "em", "s", "u", "code"]) expect(container.querySelector(tag)?.textContent).toBe("b")
    expect(screen.getByRole("link", { name: "site" }).getAttribute("rel")).toBe("noopener noreferrer")
    expect(screen.getByRole("link", { name: "local" }).getAttribute("target")).toBeNull()
    expect(screen.queryByRole("link", { name: "bad" })).toBeNull()
    expect(screen.queryByRole("heading")).toBeNull()
    expect(container.querySelector("ol")?.getAttribute("start")).toBe("3")
    expect(screen.getByText("Nested").closest("ul")).toBeTruthy()
    expect(container.querySelectorAll("li")).toHaveLength(3)
    expect(container.querySelectorAll("ul")).toHaveLength(1)
    expect(container.querySelector("blockquote")?.textContent).toBe("QuotedMore")
    expect(container.querySelectorAll("blockquote")).toHaveLength(1)
    expect(container.querySelectorAll("hr")).toHaveLength(2)
    expect(screen.getByRole("rowheader", { name: "Row" }).getAttribute("scope")).toBe("row")
    expect(container.querySelectorAll("table")).toHaveLength(1)
    expect(container.querySelector("pre, colgroup, img")).toBeNull()
  })

  // Protects: deeply nested CMS content is cut off instead of overflowing the renderer.
  it("stops rendering past the nesting limit", () => {
    let node: RichContentNode = { type: "paragraph", children: [text("Deep")] }
    for (let index = 0; index < 30; index += 1) node = { type: "quote", blocks: [node] }
    render(<DocumentContent content={[node]} emptyFallback="Empty" />)
    expect(screen.queryByText("Deep")).toBeNull()
    expect(screen.getByText("Empty")).toBeTruthy()
  })

  // Protects: apps can swap in CDN images while the package keeps the alignment frame; srcset is passed through.
  it("delegates images to renderImage and keeps responsive sources by default", () => {
    const { rerender } = render(
      <DocumentContent
        content={[
          {
            type: "image",
            src: "/a.png",
            alt: "Chart",
            width: 800,
            sizes: "100vw",
            sourceSet: [
              { url: "/b.png", width: 800 },
              { url: "/a.png", width: 400 }
            ]
          }
        ]}
      />
    )
    const image = screen.getByRole("img", { name: "Chart" })
    expect(image.getAttribute("srcset")).toBe("/a.png 400w, /b.png 800w")
    expect(image.getAttribute("sizes")).toBe("100vw")
    rerender(
      <DocumentContent
        content={[{ type: "image", src: "/a.png", alt: "Chart", align: "left" }]}
        renderImage={(item) => <img src={`${item.src}?w=1`} alt={item.alt} />}
      />
    )
    expect(screen.getByRole("img", { name: "Chart" }).getAttribute("src")).toBe("/a.png?w=1")
    expect(screen.getByRole("figure").getAttribute("data-align")).toBe("left")
  })
})

describe("splitDocumentPages", () => {
  // Protects: per-page PDF output keeps every page, including empty ones between consecutive breaks.
  it("splits top-level content at page breaks", () => {
    const pages = splitDocumentPages([
      { type: "paragraph", children: [text("One")] },
      { type: "pageBreak" },
      { type: "pageBreak" },
      { type: "paragraph", children: [text("Three")] }
    ])
    expect(pages.map((page) => page.length)).toEqual([1, 0, 1])
    expect(splitDocumentPages(null)).toEqual([[]])
  })
})

describe("DocumentPage frame", () => {
  // Protects: page presets, custom sizes and zoom produce the scaled frame the preview needs.
  it("frames content at the page size and zoom with header and footer", () => {
    const { container, rerender } = render(
      <DocumentPage
        size={DocumentPageSize.A4}
        zoom={0.5}
        header="Header"
        footer="Footer"
        headerHeight={40}
        footerHeight={30}
        aria-label="Page 1">
        <DocumentContent content={document} />
      </DocumentPage>
    )
    const frame = container.querySelector<HTMLElement>('[data-slot="document-page-frame"]')
    const page = container.querySelector<HTMLElement>('[data-slot="document-page"]')
    expect(frame?.style.width).toBe("397px")
    expect(page?.style.width).toBe("794px")
    expect(page?.getAttribute("aria-label")).toBe("Page 1")
    expect(screen.getByText("Header").closest("header")?.style.minHeight).toBe("40px")
    expect(screen.getByText("Footer").closest("footer")?.style.minHeight).toBe("30px")
    rerender(<DocumentPage size={{ width: 500, height: 700 }} zoom={-1} margin={{ top: 10 }} />)
    expect(container.querySelector<HTMLElement>('[data-slot="document-page-frame"]')?.style.width).toBe("500px")
    expect(container.querySelector<HTMLElement>('[data-slot="document-page"]')?.style.paddingTop).toBe("10px")
  })
})
