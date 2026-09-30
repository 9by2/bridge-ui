# Spec: Data List

**Spec ID:** `data-list`
**Proposal:** `data-list`
**Status:** accepted

## Summary

Defines a domain-agnostic list frame with loading, error, empty and ready states, optional caller-owned heading/copy/actions, and table/card/automatic responsive presentations.

## Requirements

### REQ-001: Status rendering

Render loading skeleton rows, error DataState, caller-copy empty state, or ready rows according to status. Retry invokes only the supplied callback. Custom empty action is rendered.

**Acceptance:**

- [ ] Tests verify all four statuses and retry callback behavior.
- [ ] Loading exposes `aria-busy`; errors use `role="alert"`.

### REQ-002: Responsive rows

Ready data exposes semantic table markup in table presentation and labelled accessible row fields in card presentation. Automatic presentation switches at the narrow-screen breakpoint without horizontal overflow.

**Acceptance:**

- [ ] Tests verify table semantics and narrow-screen labels are available to assistive technology.
- [ ] Bun.WebView evidence covers desktop and mobile.

### REQ-003: Reusable cells

Provide primary/secondary stack, empty-value fallback, and end-aligned action composition accepting caller ReactNode content.

**Acceptance:**

- [ ] Cell parts are publicly exported and documented.

## Schema / API

```tsx
const DataListStatus = { loading: "loading", error: "error", empty: "empty", ready: "ready" } as const
const DataListVariant = { table: "table", card: "card", auto: "auto" } as const

<DataList
  status={DataListStatus.ready}
  variants={DataListVariant.auto}
  columns={columns}
  rows={rows}
  title="Proposals"
  description="Review proposals"
  onRetry={refetch}
  emptyTitle="No proposals"
  emptyDescription="Create one to get started"
  emptyAction={<button>Create</button>}
/>
```

The exact TypeScript shape will be finalized against existing component conventions during implementation. It must support `density` and `framed` independently for embedding use cases.

## Non-Goals

- Fetching/query state, router dependencies, business status meaning, formatting, translation, permissions, pagination, sorting, filtering, and selection.
