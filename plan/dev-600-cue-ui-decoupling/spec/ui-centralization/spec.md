# Spec: UI Centralization

**Spec ID:** `ui-centralization`
**Proposal:** `dev-600-cue-ui-decoupling`
**Status:** draft

## Summary

This specification defines how DEV-600 centralizes Cue-derived reusable presentation in `@bridge/ui`. It fixes ownership, StyleX, theme, API, accessibility, test-seam, and package-verification requirements while explicitly excluding all consumer migration and product translation ownership.

## Requirement

### REQ-001 Cue canonical recipe

Every selected package component must preserve Cue’s characterized geometry, padding, spacing, typography, responsive behavior, keyboard behavior, focus behavior, and accessibility semantics.

**Acceptance:**

- [ ] Characterization exists before replacement implementation.
- [ ] Public rendered DOM exposes documented semantic `data-slot` values.
- [ ] Visual and interaction checks cover mobile, long copy, Thai copy, dark, reduced motion, disabled, invalid, loading, open, and empty states where applicable.

### REQ-002 StyleX and semantic themes

Package-owned reusable presentation must use StyleX. Themes must resolve semantic color values for light/white, Cue dark, and future-theme layers without changing component DOM or geometry.

**Acceptance:**

- [x] Extracted package CSS is static and consumer needs no undocumented compiler transform (`test/internal/stylex-contract.test.ts`, `test/internal/stylex.test.ts`).
- [x] Theme tests prove equal semantic DOM and non-color geometry across all four layers — light, Cue dark, generic dark, and `future` (`test/component/dev-600-boundary.test.tsx`, `test/browser/theme-parity.spec.ts`).
- [x] Tokens cover surface, content, border, accent, focus ring, and status intent without product copy or consumer imports (`token.stylex.ts`; `brandText` added per DEC-012 for text-safe brand color).
- [x] No global selector forces square corners; component recipes intentionally own radius (DEC-006, DEC-008; `adapter.css` DEC-019 rule limited to CTA/avatar/capsule exceptions).

### REQ-003 Theme and Sonner authority

`@bridge/ui` must own reusable Theme and Sonner provider mechanics, including scoped portal behavior and accessible toast rendering.

**Acceptance:**

- [ ] Public provider boundaries are explicit and testable.
- [ ] Toast role, keyboard/focus restoration, portal scope, and outside sentinel behavior are verified.
- [ ] Consumers supply translated messages, actions, and side effects.

### REQ-004 Calendar date and focus contract

Calendar must expose controlled single/range date presentation with keyboard-accessible date focus and responsive layout without owning application locale, persistence, or date-domain conversion.

**Acceptance:**

- [ ] Controlled value and change callback are public test seams.
- [ ] Roving focus, keyboard navigation, focus restoration, and range selection are interaction-tested.
- [ ] Two- and multi-month responsive layout remains contained on narrow viewports.

### REQ-005 Migration-critical APIs

The package must retain or introduce migration-critical APIs: Button `xl`, Tabs link semantics, Select unstyled presentation escape hatch, and Dialog accessible portal/focus behavior.

**Acceptance:**

- [ ] Each API has a stable root and direct package export plus declaration coverage.
- [ ] Each API forwards documented native/ARIA props and refs to its semantic root.
- [ ] Button `xl`, Tabs keyboard/link behavior, Select controlled unstyled behavior, and Dialog focus/escape/final-focus behavior have public contract tests.

### REQ-006 Source and export boundary

Reusable implementation lives in package-owned source and uses only stable exports. Generated Shadcn files remain unmodified. Consumer and translation code remain outside package source.

**Acceptance:**

- [ ] Boundary checks reject `@cue/web`, `@bridge/web`, consumer paths, and product i18n imports.
- [ ] Every promoted family has an approved root and stable direct package entry.
- [ ] Packed tarball declarations plus clean Vite client and SSR fixtures resolve all public entries.

### REQ-007 Branded ticket presentation

TicketCard, TicketCover, Receipt, StatusStamp, and selected related ticket-named components are eligible package presentation components when their APIs contain only presentation-ready values, child slots, and event props.

**Acceptance:**

- [ ] Each exports documented semantic slots, native prop/ref forwarding, and accessible states.
- [ ] Each has no Cue DTO, query, route, authorization, workflow, or i18n import.
- [ ] Responsive, long/Thai copy, status, focus, and reduced-motion presentation is cataloged and tested.

### REQ-008 Test-first public seams

Production implementation must begin only after its public test seams and failing public contract tests exist.

**Acceptance:**

- [ ] Tests target public `data-slot`, forwarding, controlled callback, provider, semantic-token, and export seams instead of private implementation details.
- [ ] Tests are written red before each production component/foundation implementation.
- [ ] Package boundary, accessibility, visual, packed client, and SSR checks remain separate required gates.

## API

```tsx
type ThemeName = "light" | "cue-dark" | "future"
type ButtonSize = "default" | "sm" | "lg" | "xl"
type CalendarValue = Date | { from: Date; to?: Date } | undefined

type CalendarProps = {
  value?: CalendarValue
  onValueChange?: (value: CalendarValue) => void
}

type TicketCardProps = React.ComponentProps<"article"> & {
  children: React.ReactNode
  side?: "front" | "back"
  defaultSide?: "front" | "back"
  onSideChange?: (side: "front" | "back") => void
}
```

## Phase 3 current implementation

Receipt, StatusStamp, DetailItem, SettingItem, StickyAlert, SuccessBurst, ResponsiveImage, ProductItem/QuantityStepper, TicketCover, and TicketCard are implemented as StyleX presentation components with root and direct exports. Baseline catalog examples and component/source-boundary contracts are present. Full state catalog coverage, packed tarball, client, and SSR verification remain pending.

## Non-Goal

- Consumer migration, local duplicate deletion, application routing, container state, data access, authorization, product DTO mapping, product i18n, release publication, or theme persistence policy.
