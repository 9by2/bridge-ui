# Catalog Decision

## DEC-001: Replace the runner, preserve the intent

**GIVEN** Storybook is hard to browse
**WHEN** the user runs `bun dev`
**THEN** open a focused catalog with every component and keep browser verification separate from browsing.

## DEC-002: Isolate the preview

**GIVEN** overlay and sidebar use fixed positioning
**WHEN** a component is previewed
**THEN** render it inside an iframe with its own theme and viewport.

## DEC-003: Honest coverage

**GIVEN** the previous finite-axis matrix does not prove every rendered value and includes fixture contrast overrides
**WHEN** migrating the catalog
**THEN** retain existing examples without claiming exhaustive API or unmodified package accessibility coverage. Track remaining foundation work explicitly.
