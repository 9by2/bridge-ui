import { ResponsiveImage } from "@bridge/ui/app/component/global/responsive-image.component"
import { Heading } from "@bridge/ui/app/component/global/typography.component"
import { Button } from "@bridge/ui/app/component/shadcn/button"
import { cn } from "cn"
import { TicketIcon } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

export interface EventCtaComponentProps extends Omit<ComponentPropsWithoutRef<"section">, "children" | "title"> {
  readonly imageSrc: string
  readonly imageAlt?: string | undefined
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly actionLabel: string
  readonly ariaLabel?: string | undefined
  readonly onAction?: (() => void) | undefined
  readonly actionDisabled?: boolean | undefined
}

export function EventCtaComponent({
  imageSrc,
  imageAlt = "",
  title,
  subtitle,
  description,
  actionLabel,
  ariaLabel = title,
  onAction,
  actionDisabled,
  className,
  ...props
}: EventCtaComponentProps) {
  return (
    <section
      aria-label={ariaLabel}
      data-slot="event-cta"
      className={cn(
        "grid w-full min-w-0 grid-cols-[minmax(0,146px)_minmax(0,1fr)] gap-4 bg-brand-accent/20 p-4 text-white",
        className
      )}
      {...props}>
      <ResponsiveImage
        data-slot="event-cta-image"
        src={imageSrc}
        alt={imageAlt}
        decorative={!imageAlt}
        sizes="146px"
        className="aspect-4/5 w-full object-cover"
      />
      <div data-slot="event-cta-content" className="flex min-w-0 flex-col justify-center gap-3">
        <Heading as="h2" className="text-2xl font-bold leading-none text-white">
          {title}
        </Heading>
        <div className="flex min-w-0 flex-col gap-2 font-heading text-sm font-bold leading-[1.25] text-white">
          <p className="line-clamp-2 break-words" title={subtitle}>
            {subtitle}
          </p>
          <p className="line-clamp-2 break-words" title={description}>
            {description}
          </p>
        </div>
      </div>
      <div data-slot="event-cta-action" className="col-span-2 min-w-0">
        <Button
          type="button"
          variant="cta"
          size="xl"
          onClick={onAction}
          disabled={actionDisabled}
          className="h-11 w-full min-w-0 gap-4 rounded-none text-base font-bold">
          <TicketIcon className="size-4" aria-hidden="true" />
          {actionLabel}
        </Button>
      </div>
    </section>
  )
}
