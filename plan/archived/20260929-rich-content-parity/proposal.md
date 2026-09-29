# Rich Content Parity

**Proposal:** `rich-content-parity`
**Status:** done
**Phase:** ADHD.md package presentation boundary (follow-up to `content-video-media`)

## Problem

bridge-web still renders CMS Tiptap JSON through a local renderer (`app/lib/tiptap-render.tsx`) because `RichContent` (0.14.0) cannot express strike/underline, external links, nested lists, code blocks, tables, rules, page breaks, image layout/responsive sources, video embeds, or text alignment. Switching now would lose content.

## Scope

### In scope

- Additive typed `RichContentNode` members and fields (patch, backward compatible).
- Copy action for code block and inline code with translatable labels.
- Image render slot for consumer CDN transforms; default rendering via `ResponsiveImage`.
- Video node rendered through `VideoPlayer` with YouTube thumbnail poster.
- Catalog examples, behavior tests, browser verification, docs, patch changeset.

### Out of scope

- Tiptap import or Tiptap-to-node mapping (bridge-web owns it).
- Raw HTML rendering, arbitrary iframes, color/font-size/highlight marks.
- bridge-web edits.

## Success Criteria

- [x] Every construct rendered by bridge-web `tiptap-render.tsx` has a typed node equivalent.
- [x] Existing 0.14.0 node shapes render unchanged.
- [x] Behavior tests for URL safety, copy, spans, empty/malformed nodes pass.
- [x] typecheck, lint, test, coverage, build, catalog, browser gates pass.
- [x] Patch changeset.

## Specs

| Spec         | Path                        | Summary                   |
| ------------ | --------------------------- | ------------------------- |
| rich-content | `spec/rich-content/spec.md` | RichContent node contract |

## References

- `plan/spec/content-video-media/spec.md`
- bridge-web `app/lib/tiptap-render.tsx`, `app/component/cms/rich-content-renderer.tsx`, `app/container/shell/globals.css` (`.cms-*`)
