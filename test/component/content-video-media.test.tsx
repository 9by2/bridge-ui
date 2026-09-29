import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { RichContent, VideoPlayer, YouTubeThumbnail } from "../../app/index"

afterEach(cleanup)

describe("RichContent public presentation", () => {
  it("renders semantic content and rejects unsafe URLs without interpreting HTML", () => {
    render(
      <RichContent
        content={[
          { type: "heading", level: 2, children: [{ type: "text", text: "News" }] },
          { type: "list", ordered: false, items: [[{ type: "text", text: "Read", href: "https://example.org" }]] },
          { type: "image", src: "javascript:alert(1)", alt: "Unsafe" },
          { type: "image", src: "https://example.org/photo.jpg", alt: "Landscape" },
          { type: "paragraph", children: [{ type: "text", text: "<script>alert(1)</script>" }] }
        ]}
      />
    )
    expect(screen.getByRole("heading", { name: "News", level: 2 })).toBeTruthy()
    expect(screen.getByRole("list")).toBeTruthy()
    expect(screen.getByRole("link", { name: "Read" }).getAttribute("href")).toBe("https://example.org")
    expect(screen.getByRole("img", { name: "Landscape" }).getAttribute("src")).toBe("https://example.org/photo.jpg")
    expect(screen.queryByRole("img", { name: "Unsafe" })).toBeNull()
    expect(screen.queryByText("alert(1)")).toBeNull()
    expect(screen.getByText("<script>alert(1)</script>")).toBeTruthy()
  })

  it("uses the explicit fallback for empty or malformed content", () => {
    const { rerender } = render(<RichContent content={[]} emptyFallback="Unavailable" />)
    expect(screen.getByText("Unavailable")).toBeTruthy()
    rerender(<RichContent content={[{ type: "unsupported" }] as never} emptyFallback="Unavailable" />)
    expect(screen.getByText("Unavailable")).toBeTruthy()
    rerender(<RichContent content={[{ type: "paragraph", children: [] }]} emptyFallback="Unavailable" />)
    expect(screen.getByText("Unavailable")).toBeTruthy()
  })
})

describe("VideoPlayer public playback", () => {
  it("loads a sandboxed embed only after keyboard-accessible activation", () => {
    render(
      <VideoPlayer
        title="Demo"
        playLabel="Play Demo"
        embedUrl="https://www.youtube-nocookie.com/embed/abc"
        poster={<span>Poster</span>}
      />
    )
    expect(screen.getByText("Poster")).toBeTruthy()
    expect(screen.queryByTitle("Demo")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Play Demo" }))
    const iframe = screen.getByTitle("Demo")
    expect(iframe.getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/abc?autoplay=1")
    expect(iframe.getAttribute("sandbox")).toContain("allow-scripts")
  })

  it("does not offer playback for invalid embed URLs", () => {
    render(<VideoPlayer title="Demo" playLabel="Play Demo" embedUrl="https://evil.example/embed/abc" />)
    expect(screen.queryByRole("button")).toBeNull()
    expect(screen.queryByTitle("Demo")).toBeNull()
  })
})

describe("YouTubeThumbnail public fallback", () => {
  it("falls back on a successful tiny placeholder and does not loop", () => {
    render(<YouTubeThumbnail videoId="abc" alt="Video cover" width={1280} height={720} />)
    const image = screen.getByRole("img", { name: "Video cover" }) as HTMLImageElement
    expect(image.getAttribute("src")).toContain("maxresdefault.jpg")
    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: 120 },
      naturalHeight: { configurable: true, value: 90 }
    })
    fireEvent.load(image)
    expect(image.getAttribute("src")).toContain("hqdefault.jpg")
    fireEvent.error(image)
    expect(image.getAttribute("src")).toContain("hqdefault.jpg")
    expect(image.getAttribute("loading")).toBe("lazy")
    expect(image.getAttribute("width")).toBe("1280")
  })

  it("falls back on error and resets when video changes", () => {
    const { rerender } = render(<YouTubeThumbnail videoId="abc" alt="Cover" />)
    const image = screen.getByRole("img", { name: "Cover" })
    fireEvent.error(image)
    expect(image.getAttribute("src")).toContain("abc/hqdefault.jpg")
    rerender(<YouTubeThumbnail videoId="xyz" alt="Cover" loading="eager" />)
    expect(image.getAttribute("src")).toContain("xyz/maxresdefault.jpg")
    expect(image.getAttribute("loading")).toBe("eager")
  })
})
