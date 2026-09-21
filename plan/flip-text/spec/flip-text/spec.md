# Spec: Flip Text

**Spec ID:** `flip-text`
**Proposal:** `flip-text`
**Status:** draft

## Summary

This spec defines a reusable, application-neutral animated text presentation component. It has no default copy, interaction, routing, or application state.

## Requirements

### REQ-001 Presentation and timing

`FlipText` accepts string children plus optional `duration` (2.2 seconds), `delay` (0), `loop` (true), `separator` (space), and `together` (false).

**Acceptance:**

- [ ] Root is `data-slot="flip-text"` and accepts native span props, ref, and caller class.
- [ ] Each visible grapheme is `data-slot="flip-text-character"` and uses a StyleX rotate-X keyframe.
- [ ] Staggered mode applies sine-distributed delays; `together` applies the same delay to every grapheme; false `loop` performs one iteration.
- [ ] Reduced-motion users receive zero animation duration.

### REQ-002 Unicode and accessibility

**Acceptance:**

- [ ] Graphemes use `Intl.Segmenter`, preserving Thai combined units and emoji modifiers.
- [ ] One visually-hidden text copy supplies semantic content; visual characters are aria-hidden.
- [ ] No default copy or business interaction exists.

### REQ-003 Package contract

**Acceptance:**

- [ ] The package root exports `FlipText`.
- [ ] `@bridge/ui/flip-text` resolves to the StyleX source in declaration and JavaScript package output.
- [ ] A default catalog example exists.

## API

```tsx
type FlipTextProps = Omit<ComponentProps<"span">, "children"> & {
  children: string
  delay?: number
  duration?: number
  loop?: boolean
  separator?: string
  together?: boolean
}
```

## Non-Goals

- Application-controlled state, buttons, links, routing, or translation defaults.
