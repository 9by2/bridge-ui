# Consumer Gap Close

**Proposal:** `consumer-gap-close`
**Status:** done
**Phase:** [ADHD.md](../../ADHD.md) — Build Order 7 "Stabilize the package"

## Problem

The `bridge-web` migration audit ([artifact](https://artifact.9by2.workers.dev/artifact/01a0d205-8f86-729b-94d8-d69eaa8d7c80/)) found local forks and wrappers in the consumer that exist only because `@bridge/ui@0.9.0` lacks a capability. The remaining migration is blocked by the package, not by the consumer.

## Scope

### In scope

- P0-1 Sonner imperative `sonnerToast` export, `./sonner` subpath, toast naming JSDoc and "Which toaster?" documentation.
- P0-2 `Spinner` `size`.
- P1-1 `Page` `density` (canonical, `spacing` deprecated alias), `width`, `PageEyebrow`, `PageMeta`, `PageFilter`, `PageFormAction`; `DataState` `onRetry` / `retryLabel`.
- P1-2 `BridgeCalendar` event `color` / `muted`, holiday `meta` / `renderHoliday`, month drag-hover highlight, click/keyboard activation documentation.
- P1-3 `UploadList` composable validation, change reason, grid layout, render slots, single-file replace, `onIssue` reporting and optional inline issue display.
- P1-4 icon slot openness audit and fixes.
- P2-1 prose typography set.
- P2-2 `ResponsiveImage` `fallbackSrc` and blur `placeholder`.
- P2-3 `ShellHeader` action injection.
- P2-4 `DateRange` / `Matcher`, `MultiSelectSeparator`, `PercentCrop` / `PixelCrop` type exports.

### Out of scope

- Any `bridge-web` change (consumer migration).
- Brand, social, streaming or logo glyphs (DEC-003).
- Toast-on-error behavior in upload (DEC-002).
- Rich-text editor; already sufficient components listed in the audit.

## Success Criteria

- [x] Every workstream ships test-first public-contract coverage, catalog example, `CUSTOMIZATION.md` section and changeset.
- [x] Root and subpath exports verified by `verify:package` and `verify:tree-shaking`.
- [x] All AGENTS.md gates green; runtime coverage ≥ 90%.
- [x] Bun.WebView evidence stored in `.eval/0924-consumer-gap-close/`.

## Specs

| Spec                      | Path                                     | Summary                                                                      |
| ------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| sonner-toast              | `spec/sonner-toast/spec.md`              | Sonner imperative API export and toaster pairing                             |
| spinner-size              | `spec/spinner-size/spec.md`              | Spinner size scale                                                           |
| page-density              | `spec/page-density/spec.md`              | Page density/width/header slot/form action + DataState retry                 |
| bridge-calendar           | `spec/bridge-calendar/spec.md`           | Extends accepted calendar spec with color, muted, holiday render, drag-hover |
| upload-validation         | `spec/upload-validation/spec.md`         | Upload validation, change reason, layout, slot, issue reporting              |
| icon-slot                 | `spec/icon-slot/spec.md`                 | Consumer icon slot contract                                                  |
| prose-typography          | `spec/prose-typography/spec.md`          | Prose typography set                                                         |
| responsive-image-fallback | `spec/responsive-image-fallback/spec.md` | Fallback source and blur placeholder                                         |
| shell-header-action       | `spec/shell-header-action/spec.md`       | Header action injection                                                      |
| small-export              | `spec/small-export/spec.md`              | Type and thin wrapper exports                                                |

## References

- [Audit artifact](https://artifact.9by2.workers.dev/artifact/01a0d205-8f86-729b-94d8-d69eaa8d7c80/)
- [plan/spec/bridge-calendar](../spec/bridge-calendar/spec.md), [plan/spec/page-layout](../spec/page-layout/spec.md), [plan/spec/upload-composition](../spec/upload-composition/spec.md)
