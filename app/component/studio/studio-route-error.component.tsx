import { ErrorComponent, ForbiddenError } from "@cue/web/app/component/global/error.component"
import { getStudioDefaultPath, StudioRouteAccessDeniedError } from "@cue/web/app/config/studio/auth"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import type { ErrorComponentProps } from "@tanstack/react-router"

// Shared across every Studio section: StudioRouteAccessDeniedError is thrown
// by createStudioRouteBeforeLoad for any studioRoutePolicies entry (dashboard,
// users, event, talent, order, finance, eventCheckin, ...), so one wiring here
// covers all of them instead of a per-section forbidden view. Any other route
// error keeps today's existing generic ErrorComponent behavior unchanged.
export function StudioRouteError(props: ErrorComponentProps) {
  if (props.error instanceof StudioRouteAccessDeniedError) {
    const backTo = getStudioDefaultPath(props.error.role as never) ?? "/"
    return <ForbiddenError backTo={backTo} homeTo={null} description={m.studio_authorization_denied_description()} />
  }
  return <ErrorComponent {...props} />
}
