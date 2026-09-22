# Decisions: Component Variant Repair

### DEC-001: Today is an outline, not a competing fill

**GIVEN** today can also be selected
**WHEN** Calendar renders both modifiers
**THEN** selected keeps its primary fill and today contributes a visible outline.

### DEC-002: ImageCrop owns layout, ReactCrop owns interaction

**GIVEN** ReactCrop supplies selection interaction but no Bridge surface sizing contract
**WHEN** ImageCrop renders upstream content
**THEN** Bridge constrains the outer surface while preserving ReactCrop's intrinsic root sizing and measurement box.

### DEC-003: Catalog crop media is deterministic

**GIVEN** remote placeholder media can render late or fail under WebView
**WHEN** the crop catalog demo loads
**THEN** it uses an embedded SVG fixture with no network dependency.

### DEC-004: Range state is one horizontal track

**GIVEN** range state spans adjacent dates
**WHEN** Calendar renders middle and endpoint modifiers
**THEN** middle cells connect without gaps, endpoints use half-width tracks, and date buttons remain inset above the track.
