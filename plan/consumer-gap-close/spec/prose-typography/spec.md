# Spec: Prose Typography

**Spec ID:** `prose-typography`
**Proposal:** `consumer-gap-close`
**Status:** accepted
**Amends:** [cue-typography](../../../spec/cue-typography/spec.md)

## Summary

Adds the prose set next to `Heading` / `Body` / `TypographyLabel`: `Blockquote`, `InlineCode`, `List` (`ordered?`), `Lead`, `Muted`, `Small`, `Large`. Prose tables reuse the existing `Table` export. Every element inherits the body font stack, which already covers Thai + English mixed script (Sarabun fallback).

## Requirements

### REQ-001: Semantic element

Each primitive renders a native semantic element, forwards native props and `className`, and exposes `data-slot`: `Blockquote` → `blockquote`, `InlineCode` → `code`, `List` → `ul` (or `ol` with `ordered`), `Lead` → `p`, `Muted` → `p`, `Small` → `small`, `Large` → `div`.

**Acceptance:**

- [x] `List` renders a list role with `ordered` switching to `ol`.
- [x] Available from root and `@bridge/ui/typography`.

## Non-Goals

- A separate prose table component (use `Table`).
- Markdown rendering.
