import { m } from "@cue/web/shared/i18n/runtime/messages"
import {
  FacebookEmbedSrc,
  SocialEmbedAspectRatio,
  SocialEmbedPlatform,
  TikTokEmbedSrc,
  YouTubeEmbedSrc
} from "@cue/web/shared/lib/social-embed"
import { useEffect } from "react"

export interface SocialEmbedComponentProps {
  readonly platform: SocialEmbedPlatform
  readonly url: string
}

const IframeSandbox = "allow-scripts allow-same-origin allow-popups allow-presentation" as const

/**
 * Renders a pasted social URL as an embedded post immediately — a click-to-mount placeholder was
 * tried first but users didn't understand it (it read as a broken/missing embed rather than an
 * affordance), so the iframe (or, for Instagram, the embed script + widget) mounts directly on
 * render. See studio-event-editing-ux and event-detail-social-embed specs.
 */
export function SocialEmbedComponent({ platform, url }: SocialEmbedComponentProps) {
  const platformLabel = SocialEmbedPlatformLabel(platform)
  const aspectRatio = SocialEmbedAspectRatio(platform)

  return (
    <div
      data-aspect-ratio={aspectRatio}
      className="social-embed relative w-full overflow-hidden bg-muted"
      style={{ aspectRatio }}>
      <SocialEmbedFrame platform={platform} platformLabel={platformLabel} url={url} />
    </div>
  )
}

function SocialEmbedFrame({
  platform,
  platformLabel,
  url
}: {
  readonly platform: SocialEmbedPlatform
  readonly platformLabel: string
  readonly url: string
}) {
  const iframeTitle = m.social_embed_iframe_title({ platform: platformLabel })

  if (platform === SocialEmbedPlatform.INSTAGRAM) {
    return <InstagramEmbedWidget url={url} />
  }

  const src = SocialEmbedIframeSrc(platform, url)
  if (!src) return null

  return (
    <iframe
      title={iframeTitle}
      src={src}
      className="size-full border-0"
      sandbox={IframeSandbox}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}

function InstagramEmbedWidget({ url }: { readonly url: string }) {
  useEffect(() => {
    LoadInstagramEmbedScript()
    ProcessInstagramEmbeds()
  }, [url])

  return (
    <div className="size-full overflow-auto">
      <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14" />
    </div>
  )
}

const InstagramEmbedScriptSrc = "https://www.instagram.com/embed.js" as const

function LoadInstagramEmbedScript(): void {
  if (typeof document === "undefined") return
  if (document.querySelector(`script[src="${InstagramEmbedScriptSrc}"]`)) {
    ProcessInstagramEmbeds()
    return
  }

  const script = document.createElement("script")
  script.async = true
  script.src = InstagramEmbedScriptSrc
  script.addEventListener("load", ProcessInstagramEmbeds)
  document.head.appendChild(script)
}

function ProcessInstagramEmbeds(): void {
  const instgrm = (globalThis as { readonly instgrm?: { readonly Embeds?: { readonly process?: () => void } } }).instgrm
  instgrm?.Embeds?.process?.()
}

function SocialEmbedIframeSrc(platform: SocialEmbedPlatform, url: string): string | null {
  if (platform === SocialEmbedPlatform.YOUTUBE || platform === SocialEmbedPlatform.YOUTUBE_SHORTS) {
    return YouTubeEmbedSrc(url)
  }
  if (platform === SocialEmbedPlatform.TIKTOK) return TikTokEmbedSrc(url)
  if (platform === SocialEmbedPlatform.FACEBOOK) return FacebookEmbedSrc(url)
  return null
}

function SocialEmbedPlatformLabel(platform: SocialEmbedPlatform): string {
  if (platform === SocialEmbedPlatform.YOUTUBE) return m.social_embed_platform_youtube()
  if (platform === SocialEmbedPlatform.YOUTUBE_SHORTS) return m.social_embed_platform_youtube_shorts()
  if (platform === SocialEmbedPlatform.FACEBOOK) return m.social_embed_platform_facebook()
  if (platform === SocialEmbedPlatform.INSTAGRAM) return m.social_embed_platform_instagram()
  return m.social_embed_platform_tiktok()
}
