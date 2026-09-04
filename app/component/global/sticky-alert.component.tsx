import cn from "cnfast"
import type { ComponentPropsWithRef } from "react"

export const StickyAlertVariant = {
  WARNING: "warning",
  PENDING: "pending",
  DESTRUCTIVE: "destructive",
  SUCCESS: "success"
} as const
export type StickyAlertVariant = ValueOf<typeof StickyAlertVariant>
interface StickyAlertComponentProps extends ComponentPropsWithRef<"div"> {
  variant?: StickyAlertVariant
}

const defaultClass = "sticky top-16 z-9 px-4 py-1 text-sm"
const variantClass: Record<StickyAlertVariant, string> = {
  [StickyAlertVariant.WARNING]: `${defaultClass} bg-warning text-warning-foreground`,
  [StickyAlertVariant.PENDING]: `${defaultClass} bg-accent text-accent-foreground`,
  [StickyAlertVariant.DESTRUCTIVE]: `${defaultClass} bg-destructive text-destructive-foreground`,
  // Pairs --brand with --brand-foreground (design D12) — never --brand-accent, which
  // app/globals.css documents as fill-only at 2.66:1 and not legal as text on its own.
  [StickyAlertVariant.SUCCESS]: `${defaultClass} bg-brand text-brand-foreground`
}
export function StickyAlertComponent({
  variant = StickyAlertVariant.WARNING,
  children,
  className,
  ...props
}: StickyAlertComponentProps) {
  return (
    <div role="alert" className={cn(variantClass[variant], className)} {...props}>
      {children}
    </div>
  )
}
