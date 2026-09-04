---
name: create-plan
description: Creates and maintains structured implementation plans under plan/{{proposal}}/. Use when starting a feature, change request, or implementation task; when the user asks to plan work; or before writing code for any non-trivial change in this repository.
---

# Create Plan

All non-trivial work starts as a proposal under `plan/`. Read [plan/PROPOSAL.md](../../../plan/PROPOSAL.md) for the canonical workflow.

## When to Use

- New feature, refactor, or change request
- User says "plan", "proposal", "design doc", or "spec"
- Work spans multiple files or architectural decisions
- Bug fix that touches contracts, APIs, or data models

Skip for: typos, one-line fixes, dependency bumps with no behavior change.

## Directory Layout

```
plan/
├── PROPOSAL.md              # Workflow (do not duplicate in proposals)
├── {{proposal}}/            # Active work — kebab-case slug
│   ├── proposal.md          # Problem, scope, success criteria
│   ├── design.md            # Architecture + example code
│   ├── decision.md          # GIVEN | WHEN | THEN records
│   ├── task.md              # Implementation checklist ([ ] / [x])
│   └── spec/
│       └── {{spec}}/        # kebab-case spec slug
│           └── spec.md
├── archived/
│   └── {{YYYYMMDD}}-{{feature}}/   # Completed proposals (snapshot)
└── spec/
    └── {{spec}}/            # Canonical completed specs
        └── spec.md
```

**Naming:** `{{proposal}}` and `{{spec}}` are kebab-case (e.g. `hardware-passport`, `promptpay-escrow`).

## Workflow

```
1. CREATE  plan/{{proposal}}/  (all required files)
2. IMPLEMENT  — check off task.md as work completes
3. ARCHIVE  — copy proposal to plan/archived/{{YYYYMMDD}}-{{feature}}/
4. MIGRATE  — copy each spec/ to plan/spec/{{spec}}/spec.md
5. DELETE or leave stub  — remove active plan/{{proposal}}/ after migration (prefer delete)
```

### Step 1 — Create proposal

1. Pick a unique `{{proposal}}` slug; check `plan/` and `plan/archived/` for collisions.
2. Create all five artifacts using templates in [templates.md](templates.md).
3. Link upstream context when relevant (`ADHD.md`, `plan/IDEA.md`, phase files).
4. Do **not** start implementation until `proposal.md` scope and `task.md` exist.

### Step 2 — Implement

- Work tasks top-to-bottom in `task.md`.
- Mark `[x]` immediately when a task is done — not at PR end.
- Update `design.md` / `decision.md` when implementation diverges; add new GIVEN|WHEN|THEN rows for decisions made during build.

### Step 3–5 — Archive & sync

When all `task.md` items are `[x]`, run **`archive-plan`**:

```bash
.agents/skills/archive-plan/script/archive-plan.sh {{proposal}}
```

See [archive-plan/SKILL.md](../archive-plan/SKILL.md) for validation rules and manual fallback.

## File Responsibilities

| File | Contains | Does not contain |
| --- | --- | --- |
| `proposal.md` | Why, scope, out-of-scope, success criteria | Code, step-by-step tasks |
| `design.md` | Architecture diagram, components, **example code** | Checkbox tasks |
| `decision.md` | GIVEN \| WHEN \| THEN decision log | Architecture prose |
| `task.md` | Ordered `[ ]` checklist for implementation | Design rationale |
| `spec/{{spec}}/spec.md` | API contracts, schemas, acceptance criteria | Implementation tasks |

## decision.md Format

One decision per block:

```markdown
### DEC-001: {{title}}

**GIVEN** {{precondition or context}}
**WHEN** {{action or trigger}}
**THEN** {{expected outcome or rule}}
```

Number sequentially (DEC-001, DEC-002). Never delete — supersede with a new DEC entry.

## Change Requests

Every change request **must** follow this structure:

1. New proposal folder, **or** reopen existing proposal if same feature and not yet archived.
2. Append decisions to `decision.md`; extend `task.md` with new items.
3. If amending a shipped spec, update `plan/spec/{{spec}}/spec.md` via a new proposal that references the spec.

## Agent Checklist

```
- [ ] Proposal slug is unique and kebab-case
- [ ] proposal.md, design.md, decision.md, task.md created
- [ ] spec.md created for each bounded interface/contract
- [ ] task.md items are concrete and ordered
- [ ] Linked to ADHD.md / phase if applicable
- [ ] On completion: run `archive-plan` (see archive-plan skill)
```

## Additional Resources

- File templates: [templates.md](templates.md)
- Canonical workflow: [plan/PROPOSAL.md](../../plan/PROPOSAL.md)
- Agent guidelines: [AGENTS.md](../../AGENTS.md)
