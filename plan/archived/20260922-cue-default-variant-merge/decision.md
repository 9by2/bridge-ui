# Decisions: Cue Default Variant Merge

| ID      | Title                                     | Status   |
| ------- | ----------------------------------------- | -------- |
| DEC-001 | Merge Cue defaults with Bridge extensions | accepted |

---

### DEC-001: Merge Cue defaults with Bridge extensions

**GIVEN** Cue is the visual baseline and Bridge publishes additional variants.
**WHEN** a default component recipe is corrected.
**THEN** retain the public Bridge variant/API and layer its intentional delta over the local Cue-derived base recipe.
