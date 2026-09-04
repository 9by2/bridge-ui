# Plan Templates

Copy these into new proposal files. Replace `{{placeholders}}`.

---

## proposal.md

```markdown
# {{Title}}

**Proposal:** `{{proposal-slug}}`
**Status:** draft | in-progress | done
**Phase:** [ADHD phase link if applicable]

## Problem

{{What pain exists? Link to plan/IDEA.md or ADHD.md if relevant.}}

## Scope

### In scope

- {{item}}

### Out of scope

- {{item}}

## Success Criteria

- [ ] {{measurable outcome}}
- [ ] {{measurable outcome}}

## Specs

| Spec | Path | Summary |
| --- | --- | --- |
| {{spec-slug}} | `spec/{{spec-slug}}/spec.md` | {{one line}} |

## References

- {{links to prior art, external docs}}
```

---

## design.md

```markdown
# Design: {{Title}}

## Overview

{{2–3 sentences on approach.}}

## Architecture

```mermaid
flowchart LR
  A[{{component}}] --> B[{{component}}]
```

## Components

| Component | Responsibility | Location |
| --- | --- | --- |
| {{name}} | {{what it does}} | `{{path}}` |

## Data Flow

1. {{step}}
2. {{step}}

## Example Code

{{Minimal, runnable or near-runnable snippet showing the intended solution — not pseudocode unless unavoidable.}}

```{{lang}}
// {{file path hint}}
{{code}}
```

## Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| {{risk}} | {{mitigation}} |
```

---

## decision.md

```markdown
# Decisions: {{Title}}

| ID | Title | Status |
| --- | --- | --- |
| DEC-001 | {{title}} | accepted |

---

### DEC-001: {{title}}

**GIVEN** {{context or precondition}}
**WHEN** {{trigger or action}}
**THEN** {{outcome, rule, or constraint}}

---

<!-- Add DEC-002, DEC-003 as decisions are made -->
```

---

## task.md

```markdown
# Tasks: {{Title}}

Implementation order matters — complete top to bottom.

## Setup

- [ ] {{task}}

## Core

- [ ] {{task}}

## Integration

- [ ] {{task}}

## Verification

- [ ] {{task}}
- [ ] All specs in `spec/` reviewed against implementation
- [ ] Archive proposal per plan/PROPOSAL.md
```

---

## spec.md

```markdown
# Spec: {{Spec Title}}

**Spec ID:** `{{spec-slug}}`
**Proposal:** `{{proposal-slug}}`
**Status:** draft | accepted | superseded

## Summary

{{One paragraph — what this spec defines.}}

## Requirements

### {{REQ-001}}

{{Requirement statement}}

**Acceptance:**
- [ ] {{testable criterion}}

## Schema / API

```{{lang}}
{{types, endpoints, JSON schema}}
```

## Examples

### {{Example name}}

**Input:**
```json
{{}}
```

**Output:**
```json
{{}}
```

## Non-Goals

- {{explicitly excluded}}
```
