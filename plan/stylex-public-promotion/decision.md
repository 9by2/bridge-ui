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
