# Spec: Policy Boundary

**Spec ID:** `policy-boundary`
**Proposal:** `policy-boundary`
**Status:** accepted

## Summary

This spec define the source of truth for repository policy.

## Requirement

### REQ-001

Agent-only execution rule must live in `AGENTS.md`.

**Acceptance:**

- [ ] Agent guide reference ADHD, README, and Oxlint without duplicating repository architecture.

### REQ-002

The company-wide north star, durable repository architecture, and foundation gate must live in `ADHD.md`.

**Acceptance:**

- [ ] ADHD document the north star, component boundary, canonical theme, Storybook, StyleX, package, registry, test, foundation gate, and implementation sequence.

### REQ-004

Current project fact and command must live in `README.md`.

**Acceptance:**

- [ ] README stay concise and link ADHD, AGENTS, Oxlint, and plan.

### REQ-003

Supported deterministic source restriction must live in `oxlint.config.ts`.

**Acceptance:**

- [ ] Type assertion is rejected outside generated Shadcn source.
- [ ] Consumer package and unstable deep import are rejected outside generated Shadcn source.
- [ ] Import traversing more than one parent is rejected outside generated Shadcn source.

## Non-Goal

- Implement the UI foundation.
- Enforce semantic component/container behavior through lint alone.
