# Decisions: Nested Text Size

### DEC-001: Separate rem text tokens

**GIVEN** the em-theme-scale spec keeps `--bridge-font-size-*` em-based
**WHEN** a text-role component needs a size that does not compound
**THEN** it reads the new rem `--bridge-text-size-*` tokens, and the em scale stays as it is

### DEC-002: Body 1rem, SwimLaneBoardItem 0.875rem

**GIVEN** Body used to inherit its size and the item was 0.75em
**WHEN** both sizes become fixed
**THEN** Body is 1rem (the Theme root size) and the item is 0.875rem (the base content size)

### DEC-003: Lane track bounds

**GIVEN** the expanded track was `minmax(220px, 1fr)`
**WHEN** SwimLaneBoard renders expanded columns
**THEN** the track is `minmax(columnMinWidth, columnMaxWidth)`, defaulting to `min(18rem, 82vw)` and `20rem`, and the board's 640px grid minimum is removed
