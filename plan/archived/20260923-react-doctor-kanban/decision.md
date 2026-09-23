# Decisions: React Doctor Kanban Correctness

### DEC-001: Preserve public drag contract

**GIVEN** Kanban is a published presentation component
**WHEN** render purity and Hook order are corrected
**THEN** keep the same overlay, sortable, and callback behavior.
