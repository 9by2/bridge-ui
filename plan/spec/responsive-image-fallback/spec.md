# Spec: Responsive Image Fallback

**Spec ID:** `responsive-image-fallback`
**Proposal:** `consumer-gap-close`
**Status:** accepted

## Summary

`ResponsiveImage` gains `fallbackSrc` and a blur `placeholder`, keeping the `decorative`/`alt` rules.

## Requirements

### REQ-001: Fallback once

On the first `error`, the image swaps to `fallbackSrc` and drops `sourceSet` so the fallback is used. A second error does not swap again (no loop). Changing `src` resets the state. The caller's `onError` still fires.

**Acceptance:**

- [x] First error → `fallbackSrc`; second error keeps `fallbackSrc`; `onError` fires each time.
- [x] New `src` resets to the new source.

### REQ-002: Blur placeholder

`placeholder={{ blurDataUrl }}` renders a blurred background image until `load`, then clears it. `data-loaded` reflects load state.

**Acceptance:**

- [x] Before load the placeholder background is set; after load it is cleared and `data-loaded="true"`.
