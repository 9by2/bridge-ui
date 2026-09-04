import { cn } from "cnfast"
import type { ComponentPropsWithoutRef, ComponentType, HTMLAttributes, SVGProps } from "react"

import { Label } from "./typography.component"

export function DetailItem({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div data-slot="detail-item" className={cn("px-4", className)} {...props} />
}

export function DetailItemFrame({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex min-h-12 items-center gap-4 border-b py-2", className)} {...props} />
}

export function DetailItemIcon({
  icon: Icon,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>
}) {
  return (
    <span data-slot="detail-item-icon" className="flex size-11 shrink-0 items-center justify-center text-highlight">
      <Icon aria-hidden="true" className={className} {...props} />
    </span>
  )
}

export function DetailItemContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex min-w-0 flex-1 flex-col justify-center gap-0", className)} {...props} />
}

export function DetailItemTitle({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <Label className={cn("font-heading text-highlight leading-none text-sm", className)} {...props} />
}

export function DetailItemValue({
  className,
  highlight = false,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  readonly highlight?: boolean | undefined
}) {
  return <p className={cn("truncate leading-tight", highlight && "text-brand", className)} {...props} />
}

export function DetailItemAction({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div data-slot="detail-item-action" className={cn("shrink-0", className)} {...props} />
}
