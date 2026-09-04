import { cn } from "cn"
import { useMemo, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react"

export const responsiveImagePresentationConfig = {
  defaultFit: "cover",
  defaultFormat: "auto",
  defaultQuality: 82,
  defaultWidths: [320, 430, 640, 768, 1024, 1280, 1536, 1920]
} as const

export type ResponsiveImageFit = "cover" | "contain" | "inside" | "outside" | "fill"
export type ResponsiveImageFormat = "auto" | "avif" | "webp" | "jpg" | "png"

export interface ResponsiveImageSourceSetItem {
  readonly src: string
  readonly width: number
}

export interface ResponsiveImageSourceAttributesInput {
  readonly fit?: ResponsiveImageFit | undefined
  readonly format?: ResponsiveImageFormat | undefined
  readonly quality?: number | undefined
  readonly sizes?: string | undefined
  readonly sourceSet?: string | readonly ResponsiveImageSourceSetItem[] | undefined
  readonly src: string
  readonly transform?: boolean | undefined
  readonly width?: number | string | undefined
  readonly widths?: readonly number[] | undefined
}

export interface ResponsiveImageSourceAttributes {
  readonly sizes: string | undefined
  readonly src: string
  readonly srcSet: string | undefined
}

export interface ResponsiveImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "decoding" | "fetchPriority" | "height" | "loading" | "sizes" | "src" | "srcSet" | "width"
> {
  readonly alt?: string | undefined
  readonly decorative?: boolean | undefined
  readonly decoding?: ImgHTMLAttributes<HTMLImageElement>["decoding"] | undefined
  readonly fallbackSrc?: string | undefined
  readonly fetchPriority?: "high" | "low" | "auto" | undefined
  readonly fit?: ResponsiveImageFit | undefined
  readonly format?: ResponsiveImageFormat | undefined
  readonly height?: number | string | undefined
  readonly loading?: ImgHTMLAttributes<HTMLImageElement>["loading"] | undefined
  readonly priority?: boolean | undefined
  readonly quality?: number | undefined
  readonly sizes?: string | undefined
  readonly sourceSet?: string | readonly ResponsiveImageSourceSetItem[] | undefined
  readonly src: string
  readonly transform?: boolean | undefined
  readonly width?: number | string | undefined
  readonly widths?: readonly number[] | undefined
}

export function ResponsiveImage({
  alt,
  decorative = false,
  className,
  decoding = "async",
  fallbackSrc,
  fetchPriority,
  fit = responsiveImagePresentationConfig.defaultFit,
  format = responsiveImagePresentationConfig.defaultFormat,
  height,
  loading,
  onError,
  priority = false,
  quality = responsiveImagePresentationConfig.defaultQuality,
  sizes,
  sourceSet,
  src,
  style,
  transform = true,
  width,
  widths,
  ...props
}: ResponsiveImageProps) {
  const [hasFailed, setHasFailed] = useState(false)
  const imageSource = hasFailed && fallbackSrc ? fallbackSrc : src
  const sourceAttributes = useMemo(
    () =>
      getResponsiveImageSourceAttributes({
        src: imageSource,
        sourceSet: hasFailed ? undefined : sourceSet,
        widths,
        width,
        sizes,
        fit,
        format,
        quality,
        transform: hasFailed ? false : transform
      }),
    [fit, format, hasFailed, imageSource, quality, sizes, sourceSet, transform, width, widths]
  )
  const resolvedLoading = priority ? "eager" : (loading ?? "lazy")
  const resolvedFetchPriority = priority ? "high" : fetchPriority

  function handleImageError(event: SyntheticEvent<HTMLImageElement, Event>) {
    if (fallbackSrc && !hasFailed) {
      setHasFailed(true)
    }
    onError?.(event)
  }

  return (
    <img
      {...props}
      alt={decorative ? "" : (alt ?? "")}
      aria-hidden={decorative ? true : props["aria-hidden"]}
      className={cn(className)}
      decoding={decoding}
      fetchPriority={resolvedFetchPriority}
      height={height}
      loading={resolvedLoading}
      sizes={sourceAttributes.sizes}
      src={sourceAttributes.src}
      srcSet={sourceAttributes.srcSet}
      style={{ objectFit: fit === "contain" || fit === "inside" ? "contain" : "cover", ...style }}
      width={width}
      onError={handleImageError}
    />
  )
}

export function getResponsiveImageSourceAttributes({
  fit = responsiveImagePresentationConfig.defaultFit,
  format = responsiveImagePresentationConfig.defaultFormat,
  quality = responsiveImagePresentationConfig.defaultQuality,
  sizes,
  sourceSet,
  src,
  transform = true,
  width,
  widths
}: ResponsiveImageSourceAttributesInput): ResponsiveImageSourceAttributes {
  if (!transform || !CanTransformImageSource(src)) {
    return { src, sizes: sourceSet ? sizes : undefined, srcSet: NormalizeSourceSet(sourceSet) }
  }

  const numericWidth = NumericWidth(width)
  const resolvedSrc = numericWidth
    ? AppendImageTransformParams(src, { width: numericWidth, fit, format, quality })
    : src
  const resolvedWidths = NormalizeWidths(
    widths ?? (sizes ? responsiveImagePresentationConfig.defaultWidths : undefined),
    numericWidth
  )

  return {
    src: resolvedSrc,
    sizes: resolvedWidths.length > 0 || sourceSet ? (sizes ?? "100vw") : sizes,
    srcSet: NormalizeSourceSet(sourceSet) ?? CreateWidthSourceSet(src, resolvedWidths, { fit, format, quality })
  }
}

function NormalizeSourceSet(
  sourceSet: string | readonly ResponsiveImageSourceSetItem[] | undefined
): string | undefined {
  if (!sourceSet) return undefined
  if (typeof sourceSet === "string") return sourceSet
  if (sourceSet.length === 0) return undefined
  return sourceSet.map((source) => `${source.src} ${source.width}w`).join(", ")
}

function CreateWidthSourceSet(
  src: string,
  widths: readonly number[],
  options: { readonly fit: ResponsiveImageFit; readonly format: ResponsiveImageFormat; readonly quality: number }
): string | undefined {
  if (widths.length === 0) return undefined
  return widths.map((width) => `${AppendImageTransformParams(src, { ...options, width })} ${width}w`).join(", ")
}

function NormalizeWidths(widths: readonly number[] | undefined, width: number | undefined): readonly number[] {
  const rawWidths = widths ?? (width ? [width] : [])
  return [
    ...new Set(rawWidths.flatMap((value) => (Number.isFinite(value) && value > 0 ? [Math.round(value)] : [])))
  ].sort((left, right) => left - right)
}

function NumericWidth(width: number | string | undefined): number | undefined {
  if (typeof width === "number") return Number.isFinite(width) && width > 0 ? Math.round(width) : undefined
  if (typeof width !== "string") return undefined
  const parsed = Number.parseInt(width, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function CanTransformImageSource(src: string): boolean {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return false
  if (src.includes("X-Amz-Signature=")) return false
  if (src.includes("x-amz-signature=")) return false
  return (src.startsWith("/") && !src.startsWith("//")) || src.startsWith(windowOrigin())
}

function AppendImageTransformParams(
  src: string,
  options: {
    readonly fit: ResponsiveImageFit
    readonly format: ResponsiveImageFormat
    readonly quality: number
    readonly width?: number | undefined
  }
): string {
  const [base = "", hash = ""] = src.split("#", 2)
  const [pathname, query = ""] = base.split("?", 2)
  const params = new URLSearchParams(query)
  if (options.width) params.set("w", String(options.width))
  params.set("fit", options.fit)
  params.set("fm", options.format)
  params.set("q", String(ClampQuality(options.quality)))
  const nextQuery = params.toString()
  return `${pathname}${nextQuery ? `?${nextQuery}` : ""}${hash ? `#${hash}` : ""}`
}

function ClampQuality(quality: number): number {
  if (!Number.isFinite(quality)) return responsiveImagePresentationConfig.defaultQuality
  return Math.min(100, Math.max(1, Math.round(quality)))
}

function windowOrigin(): string {
  return typeof window === "undefined" ? "" : window.location.origin
}
