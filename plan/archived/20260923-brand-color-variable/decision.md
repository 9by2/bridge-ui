# Decisions: Brand Color Variable

### DEC-001: Public override before generated fallback

**GIVEN** existing mode-specific StyleX brand tokens
**WHEN** a host supplies `--bridge-color-brand` or a paired brand variable
**THEN** brand recipes use the host value while preserving their existing mode defaults without it.
