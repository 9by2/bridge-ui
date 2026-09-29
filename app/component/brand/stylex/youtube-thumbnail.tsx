import type { ComponentProps } from "react"

import { VideoThumbnail } from "./video-thumbnail"

export type YouTubeThumbnailProps = Omit<ComponentProps<"img">, "src" | "srcSet" | "onLoad" | "onError"> & {
  videoId: string
  alt: string
}

/**
 * @deprecated Use `VideoThumbnail` and build provider URLs in the application, e.g.
 * `src={[".../maxresdefault.jpg", ".../hqdefault.jpg"]} placeholderMaxSize={{ width: 120, height: 90 }}`.
 */
export function YouTubeThumbnail({ videoId, ...props }: YouTubeThumbnailProps) {
  const prefix = `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/`
  return (
    <VideoThumbnail
      {...props}
      src={[`${prefix}maxresdefault.jpg`, `${prefix}hqdefault.jpg`]}
      placeholderMaxSize={{ width: 120, height: 90 }}
    />
  )
}
