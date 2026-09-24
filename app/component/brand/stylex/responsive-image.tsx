import { useState, type ComponentProps, type CSSProperties } from "react"

export type ResponsiveImageSource = { media?: string; sizes?: string; srcSet: string; type?: string }
export type ResponsiveImagePlaceholder = { blurDataUrl: string }
export type ResponsiveImageProps = Omit<ComponentProps<"img">, "alt" | "src" | "srcSet" | "placeholder"> & {
  alt?: string
  decorative?: boolean
  priority?: boolean
  sourceSet?: readonly ResponsiveImageSource[]
  src: string
  /** Swapped in once after the first load error; never retried again (no error loop). */
  fallbackSrc?: string
  /** Blurred background shown until the image loads. */
  placeholder?: ResponsiveImagePlaceholder
}

type ImageState = { src: string; failed: boolean; loaded: boolean }

/** Tracks fallback and load state per `src`; resets during render when `src` changes. */
function useImageState(src: string) {
  const [state, setState] = useState<ImageState>({ src, failed: false, loaded: false })
  const current = state.src === src ? state : { src, failed: false, loaded: false }
  if (current !== state) setState(current)
  return {
    current,
    fail: () => {
      if (!current.failed) setState({ src, failed: true, loaded: false })
    },
    load: () => setState((value) => (value.src === src ? { ...value, loaded: true } : value))
  }
}

function placeholderStyle(placeholder: ResponsiveImagePlaceholder | undefined, loaded: boolean) {
  if (!placeholder || loaded) return undefined
  const value: CSSProperties = {
    backgroundImage: `url("${placeholder.blurDataUrl}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(12px)"
  }
  return value
}

export function ResponsiveImage({
  alt,
  decorative = false,
  priority = false,
  sourceSet,
  src,
  fallbackSrc,
  placeholder,
  onError,
  onLoad,
  style,
  ...prop
}: ResponsiveImageProps) {
  const { current, fail, load } = useImageState(src)
  const useFallback = current.failed && fallbackSrc !== undefined
  const blur = placeholderStyle(placeholder, current.loaded)
  const image = (
    <img
      data-slot="responsive-image"
      data-fallback={useFallback || undefined}
      data-loaded={current.loaded || undefined}
      {...prop}
      style={blur ? { ...blur, ...style } : style}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : prop.loading}
      src={useFallback ? fallbackSrc : src}
      onError={(event) => {
        fail()
        onError?.(event)
      }}
      onLoad={(event) => {
        load()
        onLoad?.(event)
      }}
    />
  )
  if (!sourceSet?.length || useFallback) return image
  return (
    <picture data-slot="responsive-image-picture">
      {sourceSet.map((source) => (
        <source key={`${source.srcSet}-${source.media ?? ""}`} {...source} />
      ))}
      {image}
    </picture>
  )
}
