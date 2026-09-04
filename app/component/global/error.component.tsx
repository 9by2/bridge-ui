import { Button } from "@cue/web/app/component/shadcn/button"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { Link } from "@tanstack/react-router"
import type { ErrorRouteComponent } from "@tanstack/react-router"
import cn from "cnfast"
import { ArrowLeftIcon, LockIcon } from "lucide-react"
import { type ReactNode } from "react"

const getErrorMessage = (error: Error) => {
  if (IsTimeoutError(error)) return "This request timed out. Please try again."
  return error.message || m.application_error_unexpected()
}

export const ErrorComponent: ErrorRouteComponent = ({ error, reset }) => {
  if (IsNavigationCancellation(error)) return null

  const handleReset = () => {
    reset()
  }

  return (
    <main role="alert" className="container mx-auto flex max-w-2xl flex-col justify-center gap-4 p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{m.application_error_label()}</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{m.application_error_title()}</h1>
        <p className="text-muted-foreground">{getErrorMessage(error)}</p>
      </div>
      <Button className="w-fit" onClick={handleReset}>
        {m.application_error_try_again()}
      </Button>
    </main>
  )
}

function IsNavigationCancellation(error: Error): boolean {
  return error.name === "AbortError"
}

function IsTimeoutError(error: Error): boolean {
  if (/\btimed out\b/i.test(error.message)) return true
  return "_tag" in error && "reason" in error && error._tag === "HttpClientError" && error.reason === "timeout"
}

type ForbiddenErrorLayout = "page" | "panel"

interface ForbiddenErrorProps {
  title?: ReactNode
  description?: ReactNode
  backTo: string
  homeTo?: string | null
  backText?: string
  homeText?: string
  layout?: ForbiddenErrorLayout
  className?: string
}

export function ForbiddenError({
  title = m.authorization_access_denied(),
  description,
  backTo,
  homeTo = "/studio",
  backText = m.authorization_go_back(),
  homeText = m.authorization_open_studio_home(),
  layout = "page",
  className
}: ForbiddenErrorProps) {
  const Heading = layout === "page" ? "h1" : "h2"

  return (
    <section
      role="alert"
      aria-labelledby="forbidden-error-title"
      className={cn(
        "w-full px-0 text-left",
        layout === "page" ? "container mx-auto min-h-[calc(100dvh-8rem)] px-4 py-16" : "py-2",
        className
      )}>
      <div className="mx-auto w-full max-w-2xl border border-border bg-card text-card-foreground">
        <div className="grid sm:grid-cols-[4.5rem_1fr]">
          <div className="flex items-start border-b border-border bg-muted/40 p-4 sm:justify-center sm:border-r sm:border-b-0">
            <div className="flex size-9 items-center justify-center border border-destructive/30 bg-destructive/10 text-destructive">
              <LockIcon className="size-4" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <p className="font-mono text-[0.6875rem] leading-none font-medium tracking-[0.12em] text-muted-foreground uppercase">
                {m.authorization_permission_boundary()}
              </p>
              <Heading id="forbidden-error-title" className="max-w-xl text-xl leading-tight font-semibold text-balance">
                {title}
              </Heading>
              {description ? (
                <p className="max-w-xl text-sm leading-6 text-muted-foreground text-pretty">{description}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center">
              <Button nativeButton={false} variant="outline" render={<Link to={backTo} />} className="w-full sm:w-auto">
                <ArrowLeftIcon className="size-4" aria-hidden="true" />
                {backText}
              </Button>
              {homeTo ? (
                <Button
                  nativeButton={false}
                  variant="default"
                  render={<Link to={homeTo} />}
                  className="w-full sm:w-auto">
                  {homeText}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
