# Spec: Sonner Toast

**Spec ID:** `sonner-toast`
**Proposal:** `consumer-gap-close`
**Status:** accepted

## Summary

The package exposes Sonner's imperative API next to its themed `SonnerToaster`, so consumers never pair a Sonner call with the Base UI `Toaster`. The existing Base UI `toast` keeps its name.

## Requirements

### REQ-001: Imperative export

Root exports `sonnerToast` (Sonner `toast`). Subpath `@bridge/ui/sonner` exports `Toaster` and `toast`. Both resolve to the single `sonner` dependency instance.

**Acceptance:**

- [x] `sonnerToast.success()` renders inside a mounted `SonnerToaster`.
- [x] `@bridge/ui/sonner` `toast` is identical to root `sonnerToast`; `Toaster` identical to root `SonnerToaster`.

### REQ-002: Naming clarity

Both `toast` exports carry JSDoc naming their engine and paired toaster. `CUSTOMIZATION.md` has "Which toaster?" and states mixing renders nothing.

**Acceptance:**

- [x] Declaration output contains the JSDoc.
- [x] Base UI `toast` export is unchanged.

## Schema / API

```ts
// @bridge/ui
export { Toaster as SonnerToaster, toast as sonnerToast } from "./component/brand/stylex/sonner"
export { toast, Toaster } from "./component/brand/stylex/toast" // Base UI
// @bridge/ui/sonner
export { Toaster, toast }
```

## Non-Goals

- Renaming or removing the Base UI `toast`.
- Toast-on-error in any component.
