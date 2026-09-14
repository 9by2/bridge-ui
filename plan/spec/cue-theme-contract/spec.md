# Spec: Cue Theme Contract

**Spec ID:** `cue-theme-contract`
**Proposal:** `cue-theme-alignment`
**Status:** accepted

## Summary

Defines the public Cue theme mode and reusable semantic presentation required for exact Cue runtime alignment without migrating Cue application code.

## Requirement

### REQ-001 Theme mode

`Theme` accepts `mode="cue"`, applies Cue dark semantic value and `color-scheme: dark`, and transfers the exact mode into portal content.

**Acceptance:**

- [x] Generic light and dark mode remain available.
- [x] Cue mode is observable through `data-pilot-theme="cue"`.

### REQ-002 Semantic action

Button exposes `cta`, `warning`, and solid `destructive` action presentation.

**Acceptance:**

- [x] CTA uses Cue mint-to-violet gradient, square shape, white text, and heading font.
- [x] Warning and destructive use solid fill with white foreground.

### REQ-003 Semantic status

Badge exposes reusable `success`, `partial-success`, and `warning` presentation.

**Acceptance:**

- [x] Saturated fill is paired with its foreground role.
- [x] Destructive Badge remains a tint using destructive text.

### REQ-004 Native presentation

Cue mode scopes browser color scheme and scrollbar treatment without leaking outside Theme.

**Acceptance:**

- [x] Cue root reports dark color scheme.
- [x] Native control and scrollbar style is scoped under `data-pilot-theme="cue"`.

## API

```tsx
type ThemeMode = "light" | "dark" | "cue"
type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "warning" | "cta" | "link"
type BadgeVariant =
  "default" | "secondary" | "destructive" | "warning" | "success" | "partial-success" | "outline" | "ghost" | "link"
```

## Non-Goal

- Product status mapping or Cue application migration.
