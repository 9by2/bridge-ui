# Spec: Cue Typography

**Spec ID:** `cue-typography`
**Proposal:** `cue-typography`
**Status:** accepted

## Summary

Bridge UI provides the semantic typography primitives extracted from Cue without importing product source or Tailwind utilities.

## Requirements

### REQ-001: Semantic typography API

`@bridge/ui/typography` exports `WAIHeading`, `Heading`, `Label`, and `Body`. The root package exports `WAIHeading`, `Heading`, `TypographyLabel`, and `Body` because `Label` is already the stable Shadcn root export.

**Acceptance:**

- [x] `Heading` defaults to semantic `h4` and supports `h1` through `h6` via `WAIHeading`.
- [x] `Label` renders a `span` and `Body` renders a `p`.

### REQ-002: Cue visual contract

`Heading` uses the heading family and highlight color; `h1`, `h2`, `h3`, and `h4` use 36px, 24px, 20px, and 18px respectively. `Body` has a 1.3 line height.

**Acceptance:**

- [x] The static StyleX package build contains typography styles using package tokens.

## Schema / API

```ts
export const WAIHeading: {
  readonly H1: "h1"
  readonly H2: "h2"
  readonly H3: "h3"
  readonly H4: "h4"
  readonly H5: "h5"
  readonly H6: "h6"
}

export function Heading(props: React.ComponentProps<"h1"> & { as?: ValueOf<typeof WAIHeading> }): React.ReactElement
export function Label(props: React.ComponentProps<"span">): React.ReactElement
export function Body(props: React.ComponentProps<"p">): React.ReactElement
```

## Non-Goals

- A general polymorphic typography system.
- Product-specific typefaces or CSS imports.
