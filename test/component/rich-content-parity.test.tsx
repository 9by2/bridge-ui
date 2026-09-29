import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { RichContent, type RichContentNode } from "../../app/index"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const text = (value: string, mark: Record<string, unknown> = {}) => ({ type: "text" as const, text: value, ...mark })

describe("RichContent marks and links", () => {
  // Protects: CMS strike/underline/combined marks keep their semantics instead of flattening to plain text.
  it("renders strike and underline alongside combined marks", () => {
    const { container } = render(
      <RichContent
        content={[
          {
            type: "paragraph",
            children: [text("gone", { strike: true }), text("key", { underline: true, bold: true, italic: true })]
          }
        ]}
      />
    )
    expect(container.querySelector("s")?.textContent).toBe("gone")
    const underline = container.querySelector("u")
    expect(underline?.textContent).toBe("key")
    expect(underline?.querySelector("strong")).toBeTruthy()
    expect(underline?.querySelector("em")).toBeTruthy()
  })

  // Protects: external links open safely in a new tab; internal links keep same-tab navigation.
  it("opens external links with noopener and keeps internal links in place", () => {
    render(
      <RichContent
        content={[
          {
            type: "paragraph",
            children: [
              text("Docs", { href: "https://example.org", external: true }),
              text("Home", { href: "/home" }),
              text("Mail", { href: "mailto:a@example.org" }),
              text("Bad", { href: "javascript:alert(1)", external: true }),
              text("Proto", { href: "//evil.example" })
            ]
          }
        ]}
      />
    )
    const docs = screen.getByRole("link", { name: "Docs" })
    expect(docs.getAttribute("target")).toBe("_blank")
    expect(docs.getAttribute("rel")).toBe("noopener noreferrer")
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("target")).toBeNull()
    expect(screen.getByRole("link", { name: "Mail" })).toBeTruthy()
    expect(screen.queryByRole("link", { name: "Bad" })).toBeNull()
    expect(screen.queryByRole("link", { name: "Proto" })).toBeNull()
    expect(screen.getByText("Bad")).toBeTruthy()
  })

  // Protects: hard breaks inside a paragraph survive mapping.
  it("renders inline line breaks but ignores a paragraph made only of breaks", () => {
    const { container, rerender } = render(
      <RichContent content={[{ type: "paragraph", children: [text("a"), { type: "lineBreak" }, text("b")] }]} />
    )
    expect(container.querySelector("p br")).toBeTruthy()
    rerender(<RichContent content={[{ type: "paragraph", children: [{ type: "lineBreak" }] }]} emptyFallback="Empty" />)
    expect(screen.getByText("Empty")).toBeTruthy()
  })
})

describe("RichContent nested lists", () => {
  // Protects: list items containing paragraphs and nested lists are not dropped.
  it("renders block list items with nested lists and keeps legacy text items", () => {
    render(
      <RichContent
        content={[
          {
            type: "list",
            ordered: true,
            start: 3,
            items: [
              [text("Legacy")],
              {
                blocks: [
                  { type: "paragraph", children: [text("Parent")] },
                  { type: "list", ordered: false, items: [{ children: [text("Child")] }] }
                ]
              },
              { blocks: [{ type: "paragraph", children: [] }] }
            ]
          }
        ]}
      />
    )
    const lists = screen.getAllByRole("list")
    expect(lists).toHaveLength(2)
    expect(lists[0]?.getAttribute("start")).toBe("3")
    const items = within(lists[0] as HTMLElement).getAllByRole("listitem")
    expect(items[0]?.textContent).toBe("Legacy")
    expect(within(items[1] as HTMLElement).getByRole("list")).toBe(lists[1])
    expect(within(lists[1] as HTMLElement).getByRole("listitem").textContent).toBe("Child")
    expect(items).toHaveLength(3)
  })

  // Protects: hostile/accidental deep nesting cannot overflow the render stack.
  it("stops rendering past the nesting limit", () => {
    let node: RichContentNode = { type: "paragraph", children: [text("deep")] }
    for (let index = 0; index < 100; index += 1) node = { type: "quote", blocks: [node] }
    render(<RichContent content={[node]} emptyFallback="Empty" />)
    expect(screen.getByText("Empty")).toBeTruthy()
  })

  // Protects: quotes may contain block content (paragraphs, lists) from the editor.
  it("renders block quotes with nested blocks", () => {
    render(
      <RichContent
        content={[
          {
            type: "quote",
            blocks: [
              { type: "paragraph", children: [text("Quoted")] },
              { type: "list", ordered: false, items: [[text("Point")]] }
            ]
          }
        ]}
      />
    )
    expect(screen.getByText("Quoted").closest("blockquote")).toBeTruthy()
    expect(screen.getByRole("listitem").closest("blockquote")).toBeTruthy()
  })
})

describe("RichContent code copy", () => {
  // Protects: readers can copy a code block and see a translated confirmation that resets.
  it("copies code block text with translated labels and resets the confirmation", async () => {
    vi.useFakeTimers()
    const copyText = vi.fn(async () => true)
    render(
      <RichContent
        copyText={copyText}
        labels={{ copyCode: "คัดลอกโค้ด", copiedCode: "คัดลอกแล้ว", code: "โค้ด" }}
        content={[{ type: "codeBlock", code: "bun install\nbun test" }]}
      />
    )
    expect(screen.getByText("โค้ด")).toBeTruthy()
    expect(screen.getByText(/bun install/).closest("pre")).toBeTruthy()
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "คัดลอกโค้ด" })))
    expect(copyText).toHaveBeenCalledWith("bun install\nbun test")
    expect(screen.getByRole("button", { name: "คัดลอกแล้ว" })).toBeTruthy()
    expect(screen.getByRole("status").textContent).toBe("คัดลอกแล้ว")
    await act(async () => vi.advanceTimersByTime(2000))
    expect(screen.getByRole("button", { name: "คัดลอกโค้ด" })).toBeTruthy()
  })

  // Protects: a failed clipboard write never claims success; default path uses navigator.clipboard.
  it("uses the clipboard by default and does not confirm a failed copy", async () => {
    const writeText = vi.fn(async () => {
      throw new Error("denied")
    })
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    render(<RichContent content={[{ type: "codeBlock", code: "x", language: "ts" }]} />)
    expect(screen.getByText("ts")).toBeTruthy()
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy code" })))
    expect(writeText).toHaveBeenCalledWith("x")
    expect(screen.getByRole("button", { name: "Copy code" })).toBeTruthy()
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined })
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy code" })))
    expect(screen.getByRole("button", { name: "Copy code" })).toBeTruthy()
  })

  // Protects: successful default clipboard path confirms.
  it("confirms a successful navigator clipboard write", async () => {
    const writeText = vi.fn(async () => undefined)
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } })
    render(<RichContent content={[{ type: "paragraph", children: [text("npm i", { code: true, copyable: true })] }]} />)
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Copy code" })))
    expect(writeText).toHaveBeenCalledWith("npm i")
    expect(screen.getByRole("button", { name: "Copied code" })).toBeTruthy()
  })

  // Protects: copy action is opt-out for blocks, opt-in for inline code, and never nested inside a link.
  it("respects copyable flags and omits copy inside links", () => {
    render(
      <RichContent
        content={[
          { type: "codeBlock", code: "plain", copyable: false },
          { type: "codeBlock", code: "" },
          {
            type: "paragraph",
            children: [text("inline", { code: true }), text("linked", { code: true, copyable: true, href: "/x" })]
          }
        ]}
      />
    )
    expect(screen.getByText("plain").closest("pre")).toBeTruthy()
    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("RichContent tables", () => {
  // Protects: merged cells, header semantics and column widths survive from the editor.
  it("renders header and body cells with spans and column widths", () => {
    const { container } = render(
      <RichContent
        labels={{ table: "Data table" }}
        content={[
          {
            type: "table",
            columnWidths: [25, 75, -1],
            rows: [
              {
                cells: [
                  { header: true, children: [text("Name")] },
                  { header: true, children: [text("Value")] }
                ]
              },
              {
                cells: [
                  { header: true, rowSpan: 2, children: [text("Group")] },
                  { colSpan: 2, blocks: [{ type: "paragraph", children: [text("Wide")] }] }
                ]
              },
              { cells: [{ colSpan: 1.5, rowSpan: 0, children: [] }] },
              { cells: [] }
            ]
          }
        ]}
      />
    )
    const table = screen.getByRole("table")
    expect(screen.getByRole("region", { name: "Data table" })).toBeTruthy()
    expect(screen.getAllByRole("columnheader").map((cell) => cell.textContent)).toEqual(["Name", "Value"])
    const group = screen.getByRole("rowheader", { name: "Group" })
    expect(group.getAttribute("rowspan")).toBe("2")
    expect(screen.getByRole("cell", { name: "Wide" }).getAttribute("colspan")).toBe("2")
    const invalid = screen.getAllByRole("cell").at(-1)
    expect(invalid?.getAttribute("colspan")).toBeNull()
    expect(invalid?.getAttribute("rowspan")).toBeNull()
    expect(within(table).getAllByRole("row")).toHaveLength(3)
    expect([...container.querySelectorAll("col")].map((col) => (col as HTMLElement).style.width)).toEqual([
      "25%",
      "75%"
    ])
  })

  // Protects: a table without renderable rows does not produce an empty grid.
  it("drops tables without rows", () => {
    render(
      <RichContent
        emptyFallback="Empty"
        content={[{ type: "table", rows: [{ cells: [] }] }, { type: "table", rows: "bad" } as never]}
      />
    )
    expect(screen.getByText("Empty")).toBeTruthy()
  })
})

describe("RichContent rules, breaks and alignment", () => {
  // Protects: horizontal rule and print page break are distinct, and page break is announced.
  it("renders horizontal rule, legacy break and a labelled page break", () => {
    render(
      <RichContent
        labels={{ pageBreak: "ขึ้นหน้าใหม่" }}
        content={[{ type: "horizontalRule" }, { type: "break" }, { type: "pageBreak" }]}
      />
    )
    const separators = screen.getAllByRole("separator")
    expect(separators).toHaveLength(3)
    const pageBreak = screen.getByRole("separator", { name: "ขึ้นหน้าใหม่" })
    expect(pageBreak.dataset.slot).toBe("rich-content-page-break")
  })

  // Protects: editor text alignment reaches the reader; unknown values are ignored.
  it("applies paragraph and heading alignment", () => {
    render(
      <RichContent
        content={[
          { type: "paragraph", align: "center", children: [text("Centered")] },
          { type: "heading", level: 3, align: "justify", children: [text("Justified")] },
          { type: "paragraph", align: "sideways" as never, children: [text("Plain")] }
        ]}
      />
    )
    expect(screen.getByText("Centered").closest("p")?.dataset.align).toBe("center")
    expect(screen.getByRole("heading", { name: "Justified", level: 3 }).dataset.align).toBe("justify")
    expect(screen.getByText("Plain").closest("p")?.dataset.align).toBeUndefined()
  })
})

describe("RichContent images", () => {
  // Protects: responsive sources, display width and placeholder pass only safe URLs.
  it("renders responsive safe images and filters unsafe sources", () => {
    const { container } = render(
      <RichContent
        content={[
          {
            type: "image",
            src: "/photo.jpg",
            alt: "Photo",
            align: "right",
            displayWidth: "30%",
            width: 1200,
            height: 800,
            sizes: "50vw",
            blurDataUrl: "data:image/png;base64,AAAA",
            sourceSet: [
              { url: "https://cdn.example/800.jpg", width: 800 },
              { url: "javascript:alert(1)", width: 400 },
              { url: "https://cdn.example/400.jpg", width: 400 },
              { url: "https://cdn.example/bad.jpg", width: -1 }
            ]
          },
          { type: "image", src: "data:image/png;base64,AAAA", alt: "Data" },
          { type: "image", src: "https://example.org/a.jpg", alt: "Unsafe blur", blurDataUrl: 'x"); color: red' },
          { type: "image", src: "https://example.org/b.jpg", alt: "Bad width", displayWidth: "calc(1px)" }
        ]}
      />
    )
    const photo = screen.getByRole("img", { name: "Photo" })
    expect(photo.getAttribute("src")).toBe("/photo.jpg")
    expect(photo.getAttribute("loading")).toBe("lazy")
    const source = container.querySelector("source")
    expect(source?.getAttribute("srcset")).toBe("https://cdn.example/400.jpg 400w, https://cdn.example/800.jpg 800w")
    expect(source?.getAttribute("sizes")).toBe("50vw")
    expect(photo.style.backgroundImage).toContain("data:image/png;base64,AAAA")
    expect(screen.queryByRole("img", { name: "Data" })).toBeNull()
    expect(screen.getByRole("img", { name: "Unsafe blur" }).style.backgroundImage).toBe("")
    expect(screen.getByRole("img", { name: "Bad width" }).style.width).toBe("")
    expect(photo.style.width).toBe("30%")
    expect(photo.closest("figure")?.dataset.align).toBe("right")
  })

  // Protects: consumers can apply their own CDN transform through a render slot with sanitized data.
  it("delegates to renderImage with sanitized data", () => {
    const renderImage = vi.fn((image) => <img alt={image.alt} src={`${image.src}?w=640`} />)
    render(
      <RichContent
        renderImage={renderImage}
        content={[
          { type: "image", src: "https://example.org/a.jpg", alt: "Slot", displayWidth: 240 },
          { type: "image", src: "ftp://example.org/a.jpg", alt: "Blocked" }
        ]}
      />
    )
    expect(renderImage).toHaveBeenCalledTimes(1)
    expect(renderImage.mock.calls[0]?.[0]).toMatchObject({
      src: "https://example.org/a.jpg",
      alt: "Slot",
      sourceSet: []
    })
    expect(screen.getByRole("img", { name: "Slot" }).getAttribute("src")).toBe("https://example.org/a.jpg?w=640")
  })
})

describe("RichContent video", () => {
  // Protects: approved YouTube embeds render as a titled deferred player; other hosts render nothing.
  it("renders safe YouTube video embeds only", () => {
    render(
      <RichContent
        labels={{ playVideo: "เล่นวิดีโอ" }}
        emptyFallback="Empty"
        content={[
          { type: "video", embedUrl: "https://www.youtube-nocookie.com/embed/abc_123", title: "Intro" },
          { type: "video", embedUrl: "https://evil.example/embed/abc", title: "Evil" },
          { type: "video", embedUrl: "https://www.youtube.com/embed/xyz", title: "" }
        ]}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "เล่นวิดีโอ: Intro" }))
    expect(screen.getByTitle("Intro").getAttribute("src")).toContain("youtube-nocookie.com/embed/abc_123")
    expect(screen.queryByTitle("Evil")).toBeNull()
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })
})

describe("RichContent Typography composition", () => {
  // Protects: CMS content renders through the shared Typography primitives, so their theme contract applies to it.
  it("renders prose through Typography, Button and Separator slots", () => {
    const { container } = render(
      <RichContent
        content={[
          { type: "heading", level: 2, children: [text("Title")] },
          { type: "paragraph", children: [text("Body"), text("x", { code: true, copyable: true })] },
          { type: "quote", children: [text("Quote")] },
          { type: "list", ordered: true, items: [[text("One")]] },
          { type: "horizontalRule" }
        ]}
      />
    )
    const slot = (name: string) => container.querySelector(`[data-slot="${name}"]`)
    expect(slot("heading")?.getAttribute("data-heading-level")).toBe("h2")
    expect(slot("body")?.textContent).toContain("Body")
    expect(slot("inline-code")?.textContent).toBe("x")
    expect(slot("blockquote")?.textContent).toBe("Quote")
    expect(slot("list")?.getAttribute("data-ordered")).toBe("true")
    expect(slot("rich-content-copy")?.getAttribute("data-size")).toBe("icon-xs")
    expect(slot("separator")).toBeTruthy()
  })
})

describe("RichContent malformed content", () => {
  // Protects: malformed nodes from an app mapper cannot crash rendering or leak partial structure.
  it("ignores malformed nodes and inline runs", () => {
    render(
      <RichContent
        emptyFallback="Empty"
        content={
          [
            null,
            "text",
            { type: "paragraph", children: "nope" },
            { type: "paragraph", children: [null, { type: "text", text: 1 }] },
            { type: "list", ordered: false, items: [null, { children: "x" }, 5] },
            { type: "quote" },
            { type: "codeBlock", code: 5 },
            { type: "video", embedUrl: 5, title: "x" },
            { type: "image", src: "/a.jpg", alt: 5 },
            { type: "heading", level: 9, children: [text("x")] }
          ] as never
        }
      />
    )
    expect(screen.getByText("Empty")).toBeTruthy()
  })
})
