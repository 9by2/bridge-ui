# Package Blockers for Consumer Replacement

**Proposal:** `consumer-replacement-requirement`
**Status:** done
**Phase:** [Foundation ready for consumer implementation](../../ADHD.md#current-reality)

## Problem

bridge-web cannot delete four local UI pieces because `@bridge/ui` 0.11.0 lacks the capability ([audit](https://artifact.9by2.workers.dev/artifact/01a0d842-1ae9-70e1-947a-f745c33a7298/)):

| Gap                    | What blocks the consumer today                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1 `FilePreviewDialog` | `UploadViewer` needs a URL up front. It has no loading or error state and no custom action, and it always shows fallback copy under a PDF.                                   |
| G2 advanced `Dropzone` | CMS and media screens need a custom drop surface and a way to hide the preview or show thumbnails. The package has the parts but no preview choice and no documented recipe. |
| G4 profile genre field | `MultiSelectTrigger` is fixed at `fit-content`. Filling the row needs a descendant selector, which the consumer forbids.                                                     |
| G5 `CmsTagPicker`      | The `ComboboxChip` remove button has no accessible name, so the consumer avoids `ComboboxChips`.                                                                             |

Until these ship, the consumer keeps duplicate presentation and cannot finish replacement.

## Appetite

**Small batch: about 3 working days, one engineer.** Each gap is an additive prop on an owned brand component. If a gap needs more than the shaped solution below, cut that gap and ship the rest rather than extend the batch.

## Solution

Fat-marker sketch. The exact props and acceptance criteria are in the [spec](spec/consumer-replacement/spec.md).

```text
UploadViewer   status: loading ──▶ ready ──▶ (error)
               loading: status message, no media, no link
               ready:   media + download + caller action + Close
               error:   fallback alert (the only place PDF fallback appears)

UploadList     preview: none | row | thumbnail   (layout still list | grid)
               none hides the default items; picking, validation and callbacks still run

Custom surface recipe A: DropArea onDrop + your own children     (raw files)
               recipe B: UploadList children/renderEmpty/renderItem (validated value)
               never nest A inside B

MultiSelectTrigger  width: intrinsic (default) | full
ComboboxChip        removeLabel: string, one per chip; no label means no remove button
```

Build order: G5 and G4 first (small, low risk), then G1, then G2. Catalog examples, CUSTOMIZATION.md and the changeset go in with each gap, not at the end.

## Rabbit Holes

- **PDF failure detection.** Iframe load and error events do not tell you whether a PDF rendered. Don't try to detect it; the caller sets `status="error"` (DEC-003).
- **Raw drop callback on `UploadList`.** It is tempting, but it duplicates `DropArea` and invites nested file inputs. Document the recipe instead (DEC-002).
- **Preview versus layout.** Keep them independent. When `preview` is omitted, behave exactly as today: row items in list layout, tile items in grid layout (DEC-005).
- **Thumbnail URLs.** Creating and revoking object URLs stays with the consumer. The package only renders the `thumbnail` it is given.
- **`asChild` trigger width.** Apply the width to the rendered trigger. Don't change the width of every `Button`.
- **Generated Shadcn source.** Change only the owned `brand/stylex` files. Never hand-edit `app/component/shadcn/**`.

## No-Gos

- No edits to bridge-web or any consumer migration in this repository.
- No blob fetching, CDN URL building, file DTO mapping, toasts or translated copy inside the package.
- No `TypographyTable`: it has no production importer.
- No new raw `onDrop` on `UploadList`.
- No behaviour changes beyond these four gaps, except one deliberate fix: a chip remove button with no name stops rendering.

## Scope

### In scope

- `UploadViewer`: `status`, `statusLabel`, optional `source.url`, `action`, and fallback shown only on failure.
- `UploadList`: `preview` (`none|row|thumbnail`), plus two documented custom-surface recipes.
- `MultiSelectTrigger`: `width="full"`. `ComboboxChip`: `removeLabel`.
- Public-contract tests, catalog and browser checks, CUSTOMIZATION.md, and a changeset.

### Out of scope

Everything under No-Gos. Consumer migration waves are a separate bridge-web proposal, started after this ships.

## Success Criteria

- [x] G1, G2, G4 and G5 are satisfied through public, typed APIs. The only behaviour change for existing callers is the unnamed chip remove fix.
- [x] Each new behaviour has a public-contract test at the cheapest reliable seam. Browser checks cover focus, keyboard, PDF state and upload selection.
- [x] Catalog, accessibility, packed client/SSR, tree-shaking and foundation gates pass. CUSTOMIZATION.md and a changeset describe the additions.

## Specs

| Spec                 | Path                                | Summary                                             |
| -------------------- | ----------------------------------- | --------------------------------------------------- |
| consumer-replacement | `spec/consumer-replacement/spec.md` | Exact package APIs and acceptance for the four gaps |

## References

- [bridge-web × @bridge/ui 0.11.0 audit](https://artifact.9by2.workers.dev/artifact/01a0d842-1ae9-70e1-947a-f745c33a7298/)
- [ADHD.md](../../ADHD.md)
- [Upload validation](../spec/upload-validation/spec.md)
- [Upload composition](../spec/upload-composition/spec.md)
