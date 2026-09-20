# Decision Log

### DEC-001: Separate Promotion From Candidate

**GIVEN** the private candidate implementation and verification are complete
**WHEN** public exports, CSS or registry behavior changes
**THEN** perform that work in this successor proposal so private completion is not confused with publication.

### DEC-002: Preserve Generated Reference

**GIVEN** generated Shadcn source must not be hand-edited
**WHEN** a component is promoted
**THEN** add owned source and redirect supported public paths atomically, retaining generated source as reference until no supported path depends on it.

### DEC-003: RC Before Consumer Migration

**GIVEN** publication and consumer compatibility are irreversible release concerns
**WHEN** promotion verification passes
**THEN** publish a reviewed minor RC through release automation, install that exact registry artifact in Bridge Web, and defer stable/Cue work.

### DEC-004: Public CSS Split

**GIVEN** promoted runtime owns no Tailwind utility class
**WHEN** packaging `@bridge/ui/style.css`
**THEN** emit fonts, focus-guard normalization, extracted StyleX and scoped adapter only. Keep `app/style/global.css` for legacy catalog/reference use, not package output.

### DEC-005: Disable Optional Media Reordering

**GIVEN** StyleX 0.19 media-query ordering fails on the complete multi-entry graph
**WHEN** Bun or Vite compiles promoted source
**THEN** set `enableMediaQueryOrder: false` consistently and rely on deterministic CSS layer/source order already verified by computed-style tests.

### DEC-006: Square Corner Invariant

**GIVEN** every Bridge UI component must use `rounded-none`
**WHEN** a package component or its pseudo-element renders a `data-slot`
**THEN** public component CSS forces `border-radius: 0` for the slot, every descendant and their `::before`/`::after` inside the package Theme boundary, including portaled content. Component-specific radius variants remain API-compatible but have no visual effect.
