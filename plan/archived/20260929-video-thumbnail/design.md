# Design: Video Thumbnail

`VideoThumbnail` sanitizes `src` candidates, tracks the current index keyed by the candidate list, and advances on `error` or placeholder-sized `load`. `YouTubeThumbnail` maps `videoId` to `[maxresdefault, hqdefault]` with a 120x90 placeholder size.

```tsx
<VideoThumbnail src={[max, hq]} placeholderMaxSize={{ width: 120, height: 90 }} alt="" />
```
