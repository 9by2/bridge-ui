import { Button } from "@bridge/ui/app/component/shadcn/button"
import { useWindowSize } from "@uidotdev/usehooks"
import { cn } from "cn"
import { useMemo, useRef, type ComponentPropsWithoutRef } from "react"

import { Heading } from "./typography.component"

export interface PurchaseCTAProps extends Omit<ComponentPropsWithoutRef<"section">, "children"> {
  readonly priceLabel: string
  readonly price: string
  readonly actionLabel: string
  readonly onPurchase?: (() => void) | undefined
  readonly actionDisabled?: boolean | undefined
}

export function PurchaseCTA({
  priceLabel,
  price,
  actionLabel,
  onPurchase,
  actionDisabled,
  className,
  ...props
}: PurchaseCTAProps) {
  const windowSize = useWindowSize()
  const containerRef = useRef<HTMLDivElement>(null)
  const containerHeight = useMemo<number>(() => {
    if (!containerRef?.current) return 0
    return containerRef.current.clientHeight
  }, [windowSize])
  return (
    <>
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `body { --purchase-cta-height: ${containerHeight}px } @media only screen and (min-width: 768px) { body { --purchase-cta-height: 0 } }`
        }}
      />
      <section
        ref={containerRef}
        data-slot="purchase-cta"
        className={cn(
          "flex w-full items-center justify-between gap-4 border-t bg-background/80 p-4 backdrop-blur-md",
          className
        )}
        {...props}>
        <div data-slot="purchase-cta-pricing" className="flex self-stretch flex-col justify-center">
          <Heading as="h6">{priceLabel}</Heading>
          <div className="font-number text-2xl font-bold leading-none text-highlight">{price}</div>
        </div>
        <Button size="xl" variant="cta" onClick={onPurchase} disabled={actionDisabled}>
          {actionLabel}
        </Button>
      </section>
    </>
  )
}
