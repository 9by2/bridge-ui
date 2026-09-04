import { Button } from "@cue/web/app/component/shadcn/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@cue/web/app/component/shadcn/empty"
import { Link } from "@tanstack/react-router"
import type { ComponentProps } from "react"

/** Structural continue target — callers use concrete route literals; Link props stay loose at this UI seam. */
export type RouteMovedContinueLink = {
  readonly to: string
  readonly params?: Record<string, string> | undefined
  readonly search?: Record<string, unknown> | undefined
}

export interface RouteMovedNoticeProps {
  readonly titleId?: string | undefined
  readonly title: string
  readonly description: string
  readonly continueLabel: string
  readonly continueLink: RouteMovedContinueLink
}

export function RouteMovedNoticeComponent({
  titleId = "route-moved-title",
  title,
  description,
  continueLabel,
  continueLink
}: RouteMovedNoticeProps) {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <Empty className="gap-8 rounded-none border-0 p-0" aria-labelledby={titleId}>
        <EmptyHeader className="gap-4">
          <div className="flex flex-col gap-4">
            <EmptyTitle
              id={titleId}
              role="heading"
              aria-level={1}
              className="text-2xl font-medium leading-[1.3] text-highlight">
              {title}
            </EmptyTitle>
            <EmptyDescription className="font-body text-base text-highlight/70">{description}</EmptyDescription>
          </div>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="cta"
            size="xl"
            className="min-w-32"
            nativeButton={false}
            render={<Link {...(continueLink as unknown as ComponentProps<typeof Link>)}>{continueLabel}</Link>}
          />
        </EmptyContent>
      </Empty>
    </main>
  )
}
