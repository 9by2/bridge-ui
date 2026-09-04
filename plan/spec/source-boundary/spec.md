# Spec: Source Boundary

**Spec ID:** `source-boundary`
**Proposal:** `phase-1-clean-boundary`
**Status:** accepted

## Summary

This spec defines which source and dependency may exist in `@bridge/ui` before package build work begins. It applies to hand-authored production source and keeps generated Shadcn source as an explicit unchanged exception.

## Requirements

### REQ-001: Package ownership

Production source must implement reusable UI responsibility only.

**Acceptance:**

- [x] No hand-authored non-Shadcn component remains without an approved reusable contract.
- [x] No retained module owns route, data access, business state, authorization, domain mapping, or product workflow.
- [x] `app/component/studio/`, `app/component/ticket/`, and production container source do not exist.

### REQ-002: Consumer independence

Production source must be independent from every consumer application.

**Acceptance:**

- [x] No production source imports `@cue/web` or `@bridge/web`.
- [x] No production source imports consumer mapper, DTO, route, repository, usecase, adapter, config, authorization, or domain contract.
- [x] Automated verification rejects representative forbidden imports.

### REQ-003: Copy ownership

The package must not own translated product copy.

**Acceptance:**

- [x] No production source imports product i18n message or runtime module.
- [x] No retained hand-authored component renders product copy.
- [x] The package does not introduce an i18n provider or translated message catalog.

### REQ-004: Internal import boundary

Hand-authored source must not use private package paths as internal aliases.

**Acceptance:**

- [x] Hand-authored source has zero `@bridge/ui/app/**`, `@bridge/ui/internal/**`, and `@bridge/ui/cmd/**` import.
- [x] Local relative imports traverse no more than one parent directory.
- [x] Generated Shadcn source is excluded from this hand-authored rule and remains unchanged.

### REQ-005: Shared logic

Reusable non-component logic must live outside component modules.

**Acceptance:**

- [x] No reusable hand-authored logic remains that requires a `shared/` module.
- [x] No shared logic has a consumer application dependency.
- [x] Boundary behavior is tested through the agreed CLI seam.

### REQ-006: Type safety

Retained hand-authored source must satisfy the repository TypeScript and lint policy.

**Acceptance:**

- [x] Retained hand-authored source contains no type assertion.
- [x] No retained hand-authored runtime constant requires a derived `ValueOf<typeof ...>` type.
- [x] Retained hand-authored production source and boundary tooling typecheck.
- [x] `bun lint` has no hand-authored source error.

### REQ-007: Generated source integrity

Phase 1 must not manually modify generated Shadcn component or support source.

**Acceptance:**

- [x] The final `app/component/shadcn/` tree hash matches the recorded baseline.
- [x] `app/hook/use-mobile.ts` remains unchanged as Shadcn-generated support.
- [x] The generated `chart.tsx` lint warning remains documented rather than manually patched.
- [x] Existing generated type failures remain recorded for a future Shadcn CLI refresh or package-foundation phase.

### REQ-008: Phase gate

Phase 2 package build work must remain blocked until the source boundary is clean.

**Acceptance:**

- [x] All Phase 1 task and success criteria are complete.
- [x] The final ownership inventory matches surviving source.
- [x] This proposal is ready to archive and synchronize before Phase 2 starts.

## Schema / API

Retained presentation components follow this dependency direction:

```text
consumer data and copy
        |
        v
component props and children
        |
        v
@bridge/ui presentation and UI event
        |
        v
consumer container callback
```

Forbidden production dependency direction:

```text
@bridge/ui -> consumer route, i18n, DTO, mapper, domain, repository, or workflow
```

## Examples

### Allowed component contract

```tsx
type NoticeProps = {
  readonly action?: React.ReactNode
  readonly message: React.ReactNode
  readonly title: React.ReactNode
}
```

### Forbidden component contract

```tsx
import type { StudioOrderRowView } from "@cue/web/app/mapper/studio-order.mapper"
import { m } from "@cue/web/shared/i18n/runtime/messages"
```

## Non-Goals

- Define public package exports.
- Define Storybook coverage.
- Define StyleX compilation.
- Define GitLab publication.
- Preserve application-owned copied source for backward compatibility.
