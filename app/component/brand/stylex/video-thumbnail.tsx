import { useState, type ComponentProps } from "react"

export type VideoThumbnailPlaceholderSize = { width: number; height: number }

export type VideoThumbnailProps = Omit<ComponentProps<"img">, "src" | "srcSet" | "onLoad" | "onError"> & {
  /** One URL or ordered candidates (e.g. highest resolution first). http(s) and root-relative only. */
  src: string | readonly string[]
  alt: string
  /** Treat a loaded image at or below this natural size as a provider placeholder and try the next candidate. */
  placeholderMaxSize?: VideoThumbnailPlaceholderSize
}

function safeImageUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined
  const url = value.trim()
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) return url
  try {
    return ["http:", "https:"].includes(new URL(url).protocol) ? url : undefined
  } catch {
    return undefined
  }
}

function candidates(src: VideoThumbnailProps["src"]) {
  const list: readonly unknown[] = typeof src === "string" ? [src] : Array.isArray(src) ? src : []
  return list.flatMap((item) => {
    const url = safeImageUrl(item)
    return url ? [url] : []
  })
}

/** Provider-agnostic video poster image that walks fallback candidates once each, never looping. */
export function VideoThumbnail({ src, alt, placeholderMaxSize, loading = "lazy", ...props }: VideoThumbnailProps) {
  const source = candidates(src)
  const key = source.join("\n")
  const [state, setState] = useState({ key, index: 0 })
  const current = state.key === key ? state : { key, index: 0 }
  if (current !== state) setState(current)
  const url = source[current.index]
  if (!url) return null
  const advance = () => {
    if (current.index < source.length - 1) setState({ key, index: current.index + 1 })
  }
  return (
    <img
      {...props}
      data-slot="video-thumbnail"
      alt={alt}
      loading={loading}
      src={url}
      onError={advance}
      onLoad={(event) => {
        const { naturalWidth, naturalHeight } = event.currentTarget
        if (
          placeholderMaxSize &&
          naturalWidth <= placeholderMaxSize.width &&
          naturalHeight <= placeholderMaxSize.height
        )
          advance()
      }}
    />
  )
}
