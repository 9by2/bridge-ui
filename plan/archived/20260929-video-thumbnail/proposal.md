# Video Thumbnail

**Proposal:** `video-thumbnail`
**Status:** done

## Problem

`YouTubeThumbnail` ties a presentation component to one video provider.

## Scope

- In scope: provider-agnostic `VideoThumbnail`; deprecated `YouTubeThumbnail` wrapper; RichContent `video.poster`; catalog, docs, tests, patch changeset.
- Out of scope: removing `YouTubeThumbnail` (next minor); bridge-web edits.

## Success Criteria

- [x] Package thumbnail has no provider URL logic; the deprecated alias is the only YouTube thumbnail code.
- [x] Existing `YouTubeThumbnail` behavior preserved.
- [x] Gates pass.
