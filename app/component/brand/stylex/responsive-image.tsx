import type { ComponentProps } from "react"

export type ResponsiveImageSource = { media?: string; sizes?: string; srcSet: string; type?: string }
export type ResponsiveImageProps = Omit<ComponentProps<"img">, "alt" | "src" | "srcSet"> & {
  alt?: string
  decorative?: boolean
  priority?: boolean
  sourceSet?: readonly ResponsiveImageSource[]
  src: string
}
export function ResponsiveImage({
  alt,
  decorative = false,
  priority = false,
  sourceSet,
  src,
  ...prop
}: ResponsiveImageProps) {
  const image = (
    <img
      data-slot="responsive-image"
      {...prop}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : prop.loading}
      src={src}
    />
  )
  return sourceSet?.length ? (
    <picture data-slot="responsive-image-picture">
      {sourceSet.map((source) => (
        <source key={`${source.srcSet}-${source.media ?? ""}`} {...source} />
      ))}
      {image}
    </picture>
  ) : (
    image
  )
}
