import { useState, type ComponentProps } from "react"

export type YouTubeThumbnailProps = Omit<ComponentProps<"img">, "src" | "onLoad" | "onError"> & {
  videoId: string
  alt: string
}

export function YouTubeThumbnail({ videoId, alt, loading = "lazy", ...props }: YouTubeThumbnailProps) {
  const [state, setState] = useState({ videoId, fallback: false })
  const current = state.videoId === videoId ? state : { videoId, fallback: false }
  if (current !== state) setState(current)
  const prefix = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/`
  const fallback = () => {
    if (!current.fallback) setState({ videoId, fallback: true })
  }
  return (
    <img
      {...props}
      data-slot="youtube-thumbnail"
      alt={alt}
      loading={loading}
      src={`${prefix}${current.fallback ? "hqdefault" : "maxresdefault"}.jpg`}
      onError={fallback}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= 120 && event.currentTarget.naturalHeight <= 90) fallback()
      }}
    />
  )
}
