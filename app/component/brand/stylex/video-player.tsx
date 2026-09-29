import * as stylex from "@stylexjs/stylex"
import { useState, type ReactNode } from "react"

import { token } from "./token.stylex"

export type VideoPlayerProps = {
  embedUrl: string
  title: string
  playLabel: string
  poster?: ReactNode
  variant?: "default" | "minimal"
  className?: string
}

const style = stylex.create({
  root: {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderRadius: "var(--bridge-surface-radius)",
    backgroundColor: token.muted
  },
  poster: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  button: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "white",
    boxShadow: { default: "none", ":focus-visible": `inset 0 0 0 3px ${token.ring}` }
  },
  icon: {
    display: "grid",
    placeItems: "center",
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: token.primary,
    fontSize: 32
  },
  minimal: { width: 48, height: 48, fontSize: 24 },
  frame: { display: "block", width: "100%", height: "100%", border: 0 }
})

function safeEmbed(url: string) {
  try {
    const parsed = new URL(url)
    if (
      parsed.protocol !== "https:" ||
      !["youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"].includes(
        parsed.hostname
      ) ||
      !/^\/embed\/[a-zA-Z0-9_-]+$/.test(parsed.pathname) ||
      parsed.port ||
      parsed.username ||
      parsed.password
    )
      return null
    parsed.search = "?autoplay=1"
    parsed.hash = ""
    return parsed.href
  } catch {
    return null
  }
}

export function VideoPlayer({ embedUrl, title, playLabel, poster, variant = "default", className }: VideoPlayerProps) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const safe = safeEmbed(embedUrl)
  return (
    <div data-slot="video-player" className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
      {safe && activeUrl === safe ? (
        <iframe
          title={title}
          src={safe}
          loading="lazy"
          allow="autoplay; encrypted-media; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allowFullScreen
          className={stylex.props(style.frame).className}
        />
      ) : (
        <>
          <div aria-hidden="true" className={stylex.props(style.poster).className}>
            {poster}
          </div>
          {safe && (
            <button
              type="button"
              aria-label={playLabel}
              onClick={() => setActiveUrl(safe)}
              className={stylex.props(style.button).className}>
              <span
                aria-hidden="true"
                className={stylex.props(style.icon, variant === "minimal" && style.minimal).className}>
                ▶
              </span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
