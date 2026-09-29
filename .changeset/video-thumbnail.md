---
"@bridge/ui": patch
---

Add provider-agnostic `VideoThumbnail` (`@bridge/ui/video-thumbnail`): one poster URL or ordered fallback candidates, with an optional `placeholderMaxSize` for providers that return tiny placeholders. The RichContent `video` node accepts `poster` URLs from the application. `YouTubeThumbnail` is deprecated and now wraps `VideoThumbnail`; its `data-slot` changes from `youtube-thumbnail` to `video-thumbnail`.
