import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { Button } from "@bridge/ui/app/component/shadcn/button"
import { cn } from "cnfast"
import { XIcon } from "lucide-react"
import * as React from "react"

const SheetOpenContext = React.createContext(false)

function Sheet({ open: controlledOpen, defaultOpen = false, onOpenChange, ...props }: SheetPrimitive.Root.Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const previousOverflow = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (open) {
      if (previousOverflow.current === null) previousOverflow.current = document.body.style.overflow
      return
    }
    if (previousOverflow.current === null) return
    const overflow = previousOverflow.current
    previousOverflow.current = null
    const timer = window.setTimeout(() => {
      document.body.style.overflow = overflow
    })
    return () => window.clearTimeout(timer)
  }, [open])
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean, eventDetails: SheetPrimitive.Root.ChangeEventDetails) => {
      if (controlledOpen === undefined) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen, eventDetails)
    },
    [controlledOpen, onOpenChange]
  )
  return (
    <SheetOpenContext.Provider value={open}>
      <SheetPrimitive.Root data-slot="sheet" open={open} onOpenChange={handleOpenChange} {...props} />
    </SheetOpenContext.Provider>
  )
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  style,
  width,
  minWidth = 384,
  maxWidth = 960,
  onWidthChange,
  resizable = false,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  width?: number | undefined
  minWidth?: number | undefined
  maxWidth?: number | undefined
  onWidthChange?: ((width: number) => void) | undefined
  resizable?: boolean | undefined
}) {
  const open = React.useContext(SheetOpenContext)
  const popupId = React.useId()
  const clamp = React.useCallback(
    (value: number) => Math.min(maxWidth, Math.max(minWidth, value)),
    [maxWidth, minWidth]
  )
  const resize = React.useCallback(
    (delta: number) => onWidthChange?.(clamp((width ?? minWidth) + delta)),
    [clamp, minWidth, onWidthChange, width]
  )
  const cleanupResizeRef = React.useRef<(() => void) | null>(null)
  React.useEffect(
    () => () => {
      cleanupResizeRef.current?.()
    },
    []
  )
  const pointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault()
      const startX = event.clientX
      const startWidth = width ?? minWidth
      const previousUserSelect = document.body.style.userSelect
      const move = (moveEvent: PointerEvent) => onWidthChange?.(clamp(startWidth + startX - moveEvent.clientX))
      const up = () => {
        document.body.style.userSelect = previousUserSelect
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        window.removeEventListener("pointercancel", up)
        cleanupResizeRef.current = null
      }
      cleanupResizeRef.current?.()
      cleanupResizeRef.current = up
      document.body.style.userSelect = "none"
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
      window.addEventListener("pointercancel", up)
    },
    [clamp, minWidth, onWidthChange, width]
  )
  return (
    <SheetPortal>
      {open ? (
        <>
          <SheetOverlay />
          <SheetPrimitive.Popup
            data-slot="sheet-content"
            data-sheet-popup-id={popupId}
            data-side={side}
            data-sheet-width={width}
            style={style}
            className={cn(
              "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]",
              width === undefined && "data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
              className
            )}
            {...props}>
            {resizable && side === "right" ? (
              <button
                type="button"
                aria-label="Resize detail panel"
                role="separator"
                aria-orientation="vertical"
                aria-valuemin={minWidth}
                aria-valuemax={maxWidth}
                aria-valuenow={width ?? minWidth}
                onPointerDown={pointerDown}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    resize(24)
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault()
                    resize(-24)
                  }
                  if (event.key === "Home") {
                    event.preventDefault()
                    onWidthChange?.(maxWidth)
                  }
                  if (event.key === "End") {
                    event.preventDefault()
                    onWidthChange?.(minWidth)
                  }
                }}
                className="absolute inset-y-0 left-0 w-3 cursor-ew-resize touch-none"
              />
            ) : null}
            {children}
            {showCloseButton && (
              <SheetPrimitive.Close
                data-slot="sheet-close"
                render={<Button variant="ghost" className="absolute top-3 right-3" size="icon-sm" />}>
                <XIcon />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </SheetPrimitive.Popup>
        </>
      ) : null}
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-0.5 p-4", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-heading text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
