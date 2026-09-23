# Decisions: Shared Theme Token

### DEC-001: Preserve semantic props

**GIVEN** published component props such as Slider colors and Button variants
**WHEN** retiring component-specific CSS customization names
**THEN** keep the props but derive their defaults from shared theme variables.

### DEC-002: Shared theme only

**GIVEN** mode-specific StyleX fallback colors and existing Theme portal inheritance
**WHEN** a host overrides a shared semantic CSS variable
**THEN** every applicable owned recipe responds without addressing a generated StyleX or component-specific variable.
