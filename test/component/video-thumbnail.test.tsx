import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { RichContent, VideoThumbnail, YouTubeThumbnail } from "../../app/index"

afterEach(cleanup)

const setNaturalSize = (image: HTMLElement, width: number, height: number) =>
  Object.defineProperties(image, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height }
  })

describe("VideoThumbnail provider-agnostic fallback", () => {
  // Protects: consumers pass any provider's candidates; each is tried once in order on error, never looping.
  it("walks candidate URLs in order on error and stops at the last one", () => {
    render(
      <VideoThumbnail
        src={["https://cdn.example/a.jpg", "javascript:alert(1)", "https://cdn.example/b.jpg", "/c.jpg"]}
        alt="Cover"
      />
    )
    const image = screen.getByRole("img", { name: "Cover" })
    expect(image.getAttribute("src")).toBe("https://cdn.example/a.jpg")
    expect(image.getAttribute("loading")).toBe("lazy")
    fireEvent.error(image)
    expect(image.getAttribute("src")).toBe("https://cdn.example/b.jpg")
    fireEvent.error(image)
    expect(image.getAttribute("src")).toBe("/c.jpg")
    fireEvent.error(image)
    expect(image.getAttribute("src")).toBe("/c.jpg")
  })

  // Protects: providers that serve a tiny placeholder instead of an error still advance when a minimum is set.
  it("advances when a loaded image is at or below the placeholder size", () => {
    render(<VideoThumbnail src={["/max.jpg", "/hq.jpg"]} alt="Cover" placeholderMaxSize={{ width: 120, height: 90 }} />)
    const image = screen.getByRole("img", { name: "Cover" })
    setNaturalSize(image, 1280, 720)
    fireEvent.load(image)
    expect(image.getAttribute("src")).toBe("/max.jpg")
    setNaturalSize(image, 120, 90)
    fireEvent.load(image)
    expect(image.getAttribute("src")).toBe("/hq.jpg")
  })

  // Protects: without a placeholder size, small real thumbnails are accepted.
  it("keeps small images when no placeholder size is given", () => {
    render(<VideoThumbnail src={["/a.jpg", "/b.jpg"]} alt="Cover" />)
    const image = screen.getByRole("img", { name: "Cover" })
    setNaturalSize(image, 64, 36)
    fireEvent.load(image)
    expect(image.getAttribute("src")).toBe("/a.jpg")
  })

  // Protects: changing the source list restarts from the first candidate; single string and empty input work.
  it("resets on source change and renders nothing without a safe source", () => {
    const { rerender, container } = render(<VideoThumbnail src={["/a.jpg", "/b.jpg"]} alt="Cover" />)
    fireEvent.error(screen.getByRole("img", { name: "Cover" }))
    rerender(<VideoThumbnail src="/x.jpg" alt="Cover" loading="eager" />)
    const image = screen.getByRole("img", { name: "Cover" })
    expect(image.getAttribute("src")).toBe("/x.jpg")
    expect(image.getAttribute("loading")).toBe("eager")
    rerender(<VideoThumbnail src={["ftp://x/a.jpg", "//evil/b.jpg"]} alt="Cover" />)
    expect(container.querySelector("img")).toBeNull()
  })
})

describe("YouTubeThumbnail deprecated alias", () => {
  // Protects: existing 0.14.0 consumers keep maxres -> hq behavior through the generic thumbnail.
  it("keeps the YouTube resolution fallback", () => {
    render(<YouTubeThumbnail videoId="a b" alt="Cover" width={1280} />)
    const image = screen.getByRole("img", { name: "Cover" })
    expect(image.getAttribute("src")).toBe("https://i.ytimg.com/vi/a%20b/maxresdefault.jpg")
    expect(image.getAttribute("width")).toBe("1280")
    setNaturalSize(image, 120, 90)
    fireEvent.load(image)
    expect(image.getAttribute("src")).toBe("https://i.ytimg.com/vi/a%20b/hqdefault.jpg")
  })
})

describe("RichContent video poster", () => {
  // Protects: the mapper supplies poster candidates; unsafe posters are dropped, and the player still works without one.
  it("renders mapper-supplied poster candidates behind the play button", () => {
    const { container } = render(
      <RichContent
        content={[
          {
            type: "video",
            embedUrl: "https://www.youtube-nocookie.com/embed/abc",
            title: "Intro",
            poster: ["https://i.ytimg.com/vi/abc/maxresdefault.jpg", "https://i.ytimg.com/vi/abc/hqdefault.jpg"]
          },
          { type: "video", embedUrl: "https://www.youtube.com/embed/xyz", title: "Bare", poster: "javascript:alert(1)" }
        ]}
      />
    )
    const posters = container.querySelectorAll('[data-slot="video-thumbnail"]')
    expect(posters).toHaveLength(1)
    expect(posters[0]?.getAttribute("src")).toBe("https://i.ytimg.com/vi/abc/maxresdefault.jpg")
    expect(screen.getByRole("button", { name: "Play video: Bare" })).toBeTruthy()
  })
})
