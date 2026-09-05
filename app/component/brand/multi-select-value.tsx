import { cn } from "cn"
import type { ComponentProps } from "react"

import { MultiSelectValue as PrimitiveValue } from "../shadcn/multi-select"

export function MultiSelectValue({ className, ...props }: ComponentProps<typeof PrimitiveValue>) {
  return (
    <PrimitiveValue
      {...props}
      className={cn(
        "[&_[data-selected-item]]:border-transparent [&_[data-selected-item]]:bg-primary [&_[data-selected-item]]:text-primary-foreground [&_[data-selected-item]_svg]:text-primary-foreground",
        className
      )}
    />
  )
}
