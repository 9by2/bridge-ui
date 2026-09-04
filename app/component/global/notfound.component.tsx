import { LogoComponent } from "@bridge/ui/app/component/global/logo.component"
import { Button } from "@bridge/ui/app/component/shadcn/button"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { Link, useRouterState } from "@tanstack/react-router"

export type NotFoundVariant = "default" | "event"

// react-doctor-disable-next-line only-export-components -- Existing tests and consumers import this route classifier.
export function ResolveNotFoundVariant(pathname: string): NotFoundVariant {
  return /^\/event(\/|$)/.test(pathname) ? "event" : "default"
}

export interface NotFoundComponentProps {
  readonly variant?: NotFoundVariant | undefined
}

export function NotFoundComponent({ variant }: NotFoundComponentProps = {}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const resolved = variant ?? ResolveNotFoundVariant(pathname)

  if (resolved === "event") {
    return <EventVoidTicketNotFound />
  }

  return <MissedCueNotFound />
}

function MissedCueNotFound() {
  return (
    <main className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[28%] text-center font-number text-[clamp(5.5rem,18vw,8.5rem)] leading-none font-semibold tracking-tighter text-highlight/10 select-none">
        404
      </div>
      <div className="relative flex w-full max-w-md flex-col items-center gap-4 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:transition-[opacity,transform]">
        <LogoComponent className="h-7 w-auto text-highlight" aria-hidden="true" />
        <span className="inline-flex h-5 items-center rounded-full bg-brand/15 px-2 text-xs font-medium tracking-wide text-brand">
          {m.not_found_chip()}
        </span>
        <h1 className="font-heading text-2xl leading-tight font-bold tracking-tight text-balance text-highlight">
          {m.not_found_title()}
        </h1>
        <p className="font-body text-base text-pretty text-highlight/70">{m.not_found_description()}</p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Button
            variant="default"
            size="default"
            className="min-w-28"
            nativeButton={false}
            render={<Link to="/">{m.not_found_go_home()}</Link>}
          />
          <Button variant="outline" size="default" className="min-w-28" onClick={() => window.history.back()}>
            {m.not_found_go_back()}
          </Button>
        </div>
      </div>
    </main>
  )
}

function EventVoidTicketNotFound() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-safe:transition-[opacity,transform]">
        <div className="relative w-full border border-border bg-secondary px-5 pt-5 pb-5">
          <span className="pointer-events-none absolute top-4 right-4 rotate-[-12deg] rounded-sm border-2 border-brand px-1.5 py-0.5 text-xs font-extrabold tracking-[0.12em] text-brand">
            {m.not_found_event_stamp()}
          </span>
          <div className="flex items-start justify-between gap-4 pr-14">
            <div>
              <p className="font-body text-[0.72rem] tracking-wide text-highlight/45 uppercase">
                {m.not_found_event_label()}
              </p>
              <p className="mt-1 font-heading text-base font-semibold text-highlight">—</p>
            </div>
            <div className="text-right">
              <p className="font-body text-[0.72rem] tracking-wide text-highlight/45 uppercase">
                {m.not_found_event_code_label()}
              </p>
              <p className="mt-1 font-number text-base font-semibold text-highlight">404</p>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="relative my-4 border-t border-dashed border-border before:absolute before:top-1/2 before:-left-[1.375rem] before:size-3.5 before:-translate-y-1/2 before:rounded-full before:border before:border-border before:bg-background after:absolute after:top-1/2 after:-right-[1.375rem] after:size-3.5 after:-translate-y-1/2 after:rounded-full after:border after:border-border after:bg-background"
          />
          <p className="font-body text-sm leading-6 text-pretty text-highlight/70">{m.not_found_event_description()}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Button
            variant="cta"
            size="xl"
            className="min-w-32"
            nativeButton={false}
            render={<Link to="/explore">{m.not_found_event_browse()}</Link>}
          />
          <Button
            variant="outline"
            size="default"
            className="min-w-28"
            nativeButton={false}
            render={<Link to="/">{m.not_found_go_home()}</Link>}
          />
        </div>
      </div>
    </main>
  )
}
