import { cn } from "cnfast"
import { ChevronRightIcon } from "lucide-react"
import type { ButtonHTMLAttributes, ComponentType, HTMLAttributes, SVGProps } from "react"

import { Heading } from "./typography.component"

export function SettingGroup({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-1", className)} {...props} />
}

export function SettingGroupLabel({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <div className="flex flex-col justify-center px-4">
      <Heading
        as="h6"
        className={cn("text-xs font-light uppercase leading-none text-foreground tracking-[.2em]", className)}
        {...props}>
        {children}
      </Heading>
      <div className="mt-3 h-px bg-white/5" />
    </div>
  )
}

const SettingItemClassName =
  "flex min-h-11 w-full items-center justify-between gap-3 px-4 pr-2 text-left transition-colors hover:bg-white/5 focus-visible:bg-white/5"

export function SettingItem({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" data-slot="setting-item" className={cn(SettingItemClassName, className)} {...props} />
}

export function SettingItemFrame({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="setting-item" className={cn(SettingItemClassName, className)} {...props} />
}

export function SettingItemContent({
  className,
  destructive = false,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  readonly destructive?: boolean | undefined
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 truncate text-base leading-none tracking-[-0.005em] text-highlight",
        destructive && "text-[#C63333]",
        className
      )}
      {...props}
    />
  )
}

export function SettingItemIcon({
  icon: Icon,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>
}) {
  return <Icon aria-hidden="true" data-slot="setting-item-icon" className={cn("shrink-0", className)} {...props} />
}

export function SettingItemAction({
  className,
  hidden = false,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  readonly hidden?: boolean | undefined
}) {
  if (hidden) return null

  return (
    <span
      data-testid="setting-item-action"
      className={cn("flex size-11 shrink-0 items-center justify-center text-highlight", className)}
      aria-hidden="true"
      {...props}>
      {children ?? <ChevronRightIcon className="size-6" strokeWidth={1.75} />}
    </span>
  )
}
