import { Heading } from "@bridge/ui/app/component/global/typography.component"
import { cn } from "cn"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

export interface PageHeaderProps extends Omit<ComponentPropsWithoutRef<"header">, "title"> {
  readonly title: ReactNode
  readonly actionLeft?: ReactNode
  readonly actionRight?: ReactNode
}

export function PageHeader({ title, actionLeft, actionRight, className, ...props }: PageHeaderProps) {
  return (
    <nav
      aria-label={typeof title === "string" ? title : undefined}
      className={cn("flex h-14 items-center border-b", className)}
      {...props}>
      <div data-slot="action-left" className="flex size-11 shrink-0 items-center justify-center">
        {actionLeft}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between pr-4">
        <Heading as="h6" className="truncate">
          {title}
        </Heading>
        {actionRight ? (
          <div data-slot="action-right" className="flex shrink-0 items-center justify-center">
            {actionRight}
          </div>
        ) : null}
      </div>
    </nav>
  )
}
