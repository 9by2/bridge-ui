# Decisions: Video Thumbnail

### DEC-001: Deprecate, do not remove

**GIVEN** bridge-web uses `YouTubeThumbnail` in 2 places and the release is a patch
**WHEN** introducing `VideoThumbnail`
**THEN** keep `YouTubeThumbnail` as a deprecated wrapper; remove in a future minor.

### DEC-002: Ordered candidates plus optional placeholder size

**GIVEN** providers signal missing resolutions either by error or by a tiny placeholder image
**WHEN** falling back
**THEN** accept ordered `src` candidates and an optional `placeholderMaxSize`; advance once per candidate, never loop.

### DEC-003: Application builds poster URLs

**GIVEN** the package must not know providers
**WHEN** RichContent renders a video
**THEN** the mapper passes `poster` URLs; with no poster, only the play button shows.
