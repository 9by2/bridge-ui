# Content and Video Media Contract

**Status:** accepted

`RichContent({ content?: readonly RichContentNode[] | null, emptyFallback?: ReactNode, variant?: "default" | "compact" })`: explicit typed semantic presentation nodes: text (bold/italic/code/link), paragraph, heading 1-6, bullet/ordered list with items, quote, image (src, alt), break. Invalid/empty trees render the fallback. No raw HTML or arbitrary iframe nodes. Only http(s) and relative paths for images, http(s), mailto and relative paths for links. CMS schema, HTML-to-text fallback, URL/content policy and extension mapping remain app-owned.

`VideoPlayer({ embedUrl, title, playLabel, poster?, variant?: "default" | "minimal" })`: accessible button before activation; responsive iframe after activation. Only HTTPS youtube.com or youtube-nocookie.com /embed/<id> URLs allowed; any caller query or fragment is discarded, autoplay is appended. Application must validate/select video IDs and acceptable hosts. Sandbox allow-scripts, allow-same-origin, allow-presentation; allow autoplay and fullscreen. No iframe or play button for invalid URL.

`VideoThumbnail({ src: string | string[], alt, placeholderMaxSize?, ...img })`: provider-agnostic; lazy by default; tries each safe candidate (http(s), root-relative) once on error or when the loaded natural size is at or below `placeholderMaxSize`; never loops; resets on `src` change; renders nothing without a safe candidate. The app builds provider URLs. `YouTubeThumbnail({ videoId, alt, ... })` is a deprecated wrapper (maxresdefault -> hqdefault, 120x90 placeholder).

Acceptance: accessible semantics, no unsafe URL or HTML execution, no fallback loop, no premature embed request, desktop/mobile and long/short catalog content.
