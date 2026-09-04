import {
  FacebookColorIconComponent,
  GoogleColorIconComponent,
  LineColorIconComponent,
  XColorIconComponent
} from "@bridge/ui/app/component/global/icon.component"
import { AuthAuthenticationProviders } from "@cue/web/shared/config/auth"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import type { ComponentType, SVGProps } from "react"

const IconByProvider: Partial<Record<string, ComponentType<SVGProps<SVGSVGElement>>>> = {
  [AuthAuthenticationProviders.GOOGLE]: GoogleColorIconComponent,
  [AuthAuthenticationProviders.LINE]: LineColorIconComponent,
  [AuthAuthenticationProviders.FACEBOOK]: FacebookColorIconComponent,
  [AuthAuthenticationProviders.X]: XColorIconComponent
}

export function AuthProviderIcon({
  providerId,
  className
}: {
  readonly providerId: string
  readonly className?: string
}) {
  const Icon = IconByProvider[providerId]
  if (Icon) return <Icon className={className} aria-hidden="true" />
  return <span className={className}>@</span>
}

export function AuthProviderLabel(providerId: string): string {
  switch (providerId) {
    case AuthAuthenticationProviders.GOOGLE:
      return m.studio_auth_provider_google()
    case AuthAuthenticationProviders.LINE:
      return m.studio_auth_provider_line()
    case AuthAuthenticationProviders.FACEBOOK:
      return m.studio_auth_provider_facebook()
    case AuthAuthenticationProviders.X:
      return m.studio_auth_provider_x()
    default:
      return m.studio_auth_provider_credential()
  }
}
