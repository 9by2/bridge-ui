import { cn } from "cnfast"
import { MinusIcon, PlusIcon } from "lucide-react"
import type { HTMLAttributes, ReactNode } from "react"

import { Button } from "../shadcn/button"

const ProductItemClassName =
  "flex min-h-16 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:bg-white/[0.06]"

export function ProductItemComponent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="product-item" className={cn(ProductItemClassName, className)} {...props} />
}

export function ProductItemLeading({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="product-item-leading" className={cn("shrink-0", className)} {...props} />
}

export function ProductItemContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="product-item-content" className={cn("min-w-0 flex-1 space-y-1", className)} {...props} />
}

export function ProductItemTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="product-item-title"
      className={cn("truncate font-heading text-base font-semibold leading-tight text-highlight", className)}
      {...props}
    />
  )
}

export function ProductItemMeta({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p data-slot="product-item-meta" className={cn("truncate text-sm leading-none text-brand", className)} {...props} />
  )
}

export function ProductItemAction({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="product-item-action" className={cn("shrink-0", className)} {...props} />
}

export interface ProductItemQuantityProps {
  readonly label: string
  readonly value: number
  readonly min?: number | undefined
  readonly max: number
  readonly disabled?: boolean | undefined
  readonly onValueChange: (value: number) => void
  readonly className?: string | undefined
}

export function ProductItemQuantity({
  className,
  disabled = false,
  label,
  max,
  min = 0,
  onValueChange,
  value
}: ProductItemQuantityProps) {
  const canDecrease = !disabled && value > min
  const canIncrease = !disabled && value < max

  function handleDecreaseClick() {
    onValueChange(Math.max(min, value - 1))
  }

  function handleIncreaseClick() {
    onValueChange(Math.min(max, value + 1))
  }

  return (
    <div data-slot="product-item-quantity" className={cn("flex items-center gap-2", className)}>
      <QuantityButton label={`Decrease ${label}`} disabled={!canDecrease} tone="neutral" onClick={handleDecreaseClick}>
        <MinusIcon aria-hidden="true" className="size-4" />
      </QuantityButton>
      <output
        aria-label={`${label} value`}
        className="grid h-9 min-w-8 place-items-center font-heading text-sm font-semibold text-highlight">
        {value}
      </output>
      <QuantityButton label={`Increase ${label}`} disabled={!canIncrease} tone="brand" onClick={handleIncreaseClick}>
        <PlusIcon aria-hidden="true" className="size-4" />
      </QuantityButton>
    </div>
  )
}

function QuantityButton({
  children,
  disabled,
  label,
  onClick,
  tone
}: {
  readonly children: ReactNode
  readonly disabled: boolean
  readonly label: string
  readonly onClick: () => void
  readonly tone: "brand" | "neutral"
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      disabled={disabled}
      className={cn(
        "size-9 rounded-none border-0",
        tone === "brand" ? "bg-brand text-black hover:bg-brand/90" : "bg-white/10 text-highlight hover:bg-white/15"
      )}
      onClick={onClick}>
      {children}
    </Button>
  )
}
