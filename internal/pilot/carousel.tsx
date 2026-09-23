import * as stylex from "@stylexjs/stylex"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ComponentProps } from "react"

import { Button } from "./button"

export type CarouselApi = UseEmblaCarouselType[1]
type Option = {
  opts?: Parameters<typeof useEmblaCarousel>[0]
  plugins?: Parameters<typeof useEmblaCarousel>[1]
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}
const Context = createContext<
  | (Option & {
      carouselRef: UseEmblaCarouselType[0]
      api: CarouselApi
      scrollPrev: () => void
      scrollNext: () => void
      canScrollPrev: boolean
      canScrollNext: boolean
    })
  | null
>(null)
const style = stylex.create({
  root: { position: "relative" },
  viewport: { overflow: "hidden" },
  content: { display: "flex" },
  horizontal: { marginLeft: -16 },
  vertical: { marginTop: -16, flexDirection: "column" },
  item: { boxSizing: "border-box", minWidth: 0, flexShrink: 0, flexGrow: 0, flexBasis: "100%" },
  horizontalItem: { paddingLeft: 16 },
  verticalItem: { paddingTop: 16 },
  button: { position: "absolute", touchAction: "manipulation", borderRadius: 9999 },
  previous: { top: 0, bottom: 0, left: -48, marginBlock: "auto" },
  next: { top: 0, bottom: 0, right: -48, marginBlock: "auto" },
  previousVertical: { top: -48, left: "50%", translate: "-50% 0", rotate: "90deg" },
  nextVertical: { bottom: -48, left: "50%", translate: "-50% 0", rotate: "90deg" },
  icon: { width: 16, height: 16 },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0
  }
})
export function useCarousel() {
  const context = useContext(Context)
  if (!context) throw new Error("useCarousel must be used within a <Carousel />")
  return context
}
export function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: ComponentProps<"div"> & Option) {
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: orientation === "horizontal" ? "x" : "y" }, plugins)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])
  useEffect(() => {
    if (api && setApi) setApi(api)
  }, [api, setApi])
  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }
    onSelect()
    api.on("reInit", onSelect)
    api.on("select", onSelect)
    return () => {
      api.off("reInit", onSelect)
      api.off("select", onSelect)
    }
  }, [api])
  const context = useMemo(
    () => ({ carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext }),
    [carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext]
  )
  return (
    <Context value={context}>
      <div
        onKeyDownCapture={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault()
            scrollPrev()
          } else if (event.key === "ArrowRight") {
            event.preventDefault()
            scrollNext()
          }
        }}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
        className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </Context>
  )
}
export function CarouselContent({ className, ...props }: ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()
  return (
    <div ref={carouselRef} data-slot="carousel-content" {...stylex.props(style.viewport)}>
      <div
        {...props}
        className={[
          stylex.props(style.content, orientation === "horizontal" ? style.horizontal : style.vertical).className,
          className
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  )
}
export function CarouselItem({ className, ...props }: ComponentProps<"div">) {
  const { orientation } = useCarousel()
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      {...props}
      className={[
        stylex.props(style.item, orientation === "horizontal" ? style.horizontalItem : style.verticalItem).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
      className={(state) =>
        [
          stylex.props(style.button, orientation === "horizontal" ? style.previous : style.previousVertical).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <ChevronLeftIcon {...stylex.props(style.icon)} />
      <span {...stylex.props(style.hidden)}>Previous slide</span>
    </Button>
  )
}
export function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
      className={(state) =>
        [
          stylex.props(style.button, orientation === "horizontal" ? style.next : style.nextVertical).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <ChevronRightIcon {...stylex.props(style.icon)} />
      <span {...stylex.props(style.hidden)}>Next slide</span>
    </Button>
  )
}
