import type { ReactNode } from "react"

import * as UI from "@bridge/ui"

function Axis({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">{label}</h3>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  )
}

function Sample({ children, label }: { readonly children: ReactNode; readonly label: string }) {
  return (
    <div className="flex min-w-24 flex-col gap-1 rounded-lg border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export default function Example() {
  return (
    <Axis label="orientation">
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Sample key={orientation} label={orientation}>
          <UI.Carousel
            aria-label={`${orientation} carousel`}
            orientation={orientation}
            className={orientation === "vertical" ? "h-48 w-48" : "w-48"}>
            <UI.CarouselContent className={orientation === "vertical" ? "h-48" : undefined}>
              <UI.CarouselItem>
                <div className="rounded bg-muted p-8">One</div>
              </UI.CarouselItem>
              <UI.CarouselItem>
                <div className="rounded bg-muted p-8">Two</div>
              </UI.CarouselItem>
            </UI.CarouselContent>
          </UI.Carousel>
        </Sample>
      ))}
    </Axis>
  )
}
