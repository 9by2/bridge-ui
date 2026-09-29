# Design: Content and Video Presentation

bridge-web maps its Tiptap JSON into typed presentation nodes; the package renders only an explicit allowlist. No HTML injection. bridge-web must keep HTML-to-text fallback and policies for embeds, images and links. VideoPlayer accepts a previously selected YouTube embed URL, title, playLabel, poster; it only loads an iframe after activation. YouTubeThumbnail remains separate for list usage without playback.

```tsx
import { RichContent, VideoPlayer, YouTubeThumbnail } from "@bridge/ui"

<RichContent content={[{ type: "heading", level: 2, children: [{ type: "text", text: "Hello" }] }]} emptyFallback="No content" />
<VideoPlayer title="Demo" playLabel="Play Demo" embedUrl="https://www.youtube-nocookie.com/embed/abc" poster={<YouTubeThumbnail videoId="abc" alt="" />} />
<YouTubeThumbnail videoId="abc" alt="" width={1280} height={720} />
```

The package rejects unsafe URL schemes and unsupported/malformed content. URL allowlisting is a defense-in-depth boundary, not a replacement for app authorization or ID validation. Layout uses StyleX package defaults and responsive 16:9 video surface.
