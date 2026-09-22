# Spec: UI Centralization

**Spec ID:** `ui-centralization`
**Proposal:** `dev-600-cue-ui-decoupling`
**Status:** accepted

## Summary

This specification defines how DEV-600 centralizes Cue-derived reusable presentation in `@bridge/ui`. It fixes ownership, StyleX, theme, API, accessibility, test-seam, and package-verification requirements while explicitly excluding all consumer migration and product translation ownership.

## Requirement

### REQ-001 Cue canonical recipe

Every selected package component must preserve Cue’s characterized geometry, padding, spacing, typography, responsive behavior, keyboard behavior, focus behavior, and accessibility semantics.

**Acceptance:**

- [x] Characterization exists before replacement implementation (`design.md` component ownership table; DEC-001, DEC-008, DEC-010, DEC-011).
- [x] Public rendered DOM exposes documented semantic `data-slot` values (every promoted component; verified `ticket-card`, `receipt`, `detail-item`, `setting-item`, `status-stamp`, `sticky-alert`, `success-burst`, `product-item`, `ticket-cover`, `responsive-image` each carry `data-slot`).
- [x] Visual and interaction checks cover mobile, long copy, Thai copy, dark, reduced motion, disabled, invalid, loading, open, and empty states where applicable. Migration-critical primitives: `test/browser/catalog.spec.ts` (dark/light/mobile/menu across all 69+ families), `test/browser/theme-parity.spec.ts`, `pilot-*.test.tsx` interaction suites. Phase 3 branded families: `internal/catalog/example/*/states.tsx` (long copy, Thai copy, tone/disabled variants) plus `test/browser/dev-600-presentation-states.spec.ts` (dark theme, mobile containment, reduced motion, disabled-at-bounds, empty optional slots).

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

- [x] Public provider boundaries are explicit and testable (`Theme`, `useThemeMode`, `SonnerToaster` are all public exports; `useThemeMode` is the documented public seam other portal-rendering components use instead of an external provider).
- [x] Toast role, keyboard/focus restoration, portal scope, and outside sentinel behavior are verified (`test/component/pilot-sonner.test.tsx`: DEC-009 light/dark/cue/future mapping, no-ancestor default, explicit override, and an outside-Theme-boundary sentinel proving the toaster does not inherit an unrelated sibling's mode; dialog focus-restoration coverage retained in `pilot-dialog.test.tsx`).
- [x] Consumers supply translated messages, actions, and side effects (`Toaster` forwards `ToasterProps`; no message/copy is owned by the package; `toast()` payload is entirely caller-supplied).

### REQ-004 Calendar date and focus contract

Calendar must expose controlled single/range date presentation with keyboard-accessible date focus and responsive layout without owning application locale, persistence, or date-domain conversion.

**Acceptance:**

- [x] Controlled value and change callback are public test seams (`Calendar` forwards react-day-picker's `mode`/`selected`/`onSelect`; `test/component/pilot-calendar.test.tsx` exercises single-select `onSelect` and range `selected`).
- [x] Roving focus, keyboard navigation, focus restoration, and range selection are interaction-tested (`pilot-calendar.test.tsx`: engine date selection, month navigation, stable `data-day` ISO identity, and the active-element focus guard that avoids stealing unrelated focus across multi-month panels).
- [x] Two- and multi-month responsive layout remains contained on narrow viewports (`test/browser/catalog.spec.ts` `calendar range with 2 months` / `calendar range with 4 months`; `Calendar` has a direct stable export at `@bridge/ui/calendar`).

### REQ-005 Migration-critical APIs

The package must retain or introduce migration-critical APIs: Button `xl`, Tabs link semantics, Select unstyled presentation escape hatch, and Dialog accessible portal/focus behavior.

**Acceptance:**

- [x] Each API has a stable root and direct package export plus declaration coverage (`package.json` exports `./button`, `./calendar`, `./dialog`, `./tabs`, `./select`; `test/internal/package-contract.test.ts` "migration-critical primitives have stable root and direct package exports (REQ-005)"; `bun cmd/verify-package.ts` verifies all 5 resolve from an installed tarball with declaration checking).
- [x] Each API forwards documented native/ARIA props and refs to its semantic root (`pilot-button.test.tsx`, `pilot-tabs.test.tsx`, `pilot-select.test.tsx`, `pilot-dialog.test.tsx` each assert ref/className/native prop forwarding).
- [x] Button `xl`, Tabs keyboard/link behavior, Select controlled unstyled behavior, and Dialog focus/escape/final-focus behavior have public contract tests (`pilot-button.test.tsx`, `pilot-tabs.test.tsx`, `pilot-select.test.tsx`, `pilot-dialog.test.tsx`).

### REQ-006 Source and export boundary

Reusable implementation lives in package-owned source and uses only stable exports. Generated Shadcn files remain unmodified. Consumer and translation code remain outside package source.

**Acceptance:**

- [x] Boundary checks reject `@cue/web`, `@bridge/web`, consumer paths, and product i18n imports (`test/internal/source-boundary.test.ts`; `bun cmd/check-source-boundary.ts` passes clean).
- [x] Every promoted family has an approved root and stable direct package entry (`app/index.ts` root re-exports plus dedicated `package.json` export for every promoted family, including the 5 migration-critical primitives and 10 Phase 3 branded families).
- [x] Packed tarball declarations plus clean Vite client and SSR fixtures resolve all public entries (`bun cmd/verify-package.ts`: "Verified 125 installed public entry with declaration checking", clean Vite client build, production SSR markup check).

### REQ-007 Branded ticket presentation

TicketCard, TicketCover, Receipt, StatusStamp, and selected related ticket-named components are eligible package presentation components when their APIs contain only presentation-ready values, child slots, and event props.

**Acceptance:**

- [x] Each exports documented semantic slots, native prop/ref forwarding, and accessible states (`data-slot` on every root/sub-part; `ComponentProps<...>` spread forwards native props/refs; `test/component/dev-600-presentation.test.tsx`).
- [x] Each has no Cue DTO, query, route, authorization, workflow, or i18n import (`test/component/dev-600-boundary.test.tsx` asserts no `@cue/web`/`@bridge/web`/i18n import in every Phase 3 component source file).
- [x] Responsive, long/Thai copy, status, focus, and reduced-motion presentation is cataloged and tested (`internal/catalog/example/{receipt,status-stamp,detail-item,setting-item,sticky-alert}/states.tsx` cover long/Thai copy and tone/disabled variants; `test/browser/dev-600-presentation-states.spec.ts` covers dark theme, mobile containment, reduced-motion transitions on `SuccessBurst`/`TicketCard`, and `ProductItem`/`QuantityStepper` bound-disabling).

### REQ-008 Test-first public seams

Production implementation must begin only after its public test seams and failing public contract tests exist.

**Acceptance:**

- [x] Tests target public `data-slot`, forwarding, controlled callback, provider, semantic-token, and export seams instead of private implementation details (component tests use `screen.getByRole`/`data-slot` queries, not internal StyleX class assertions; contract tests assert `package.json`/`app/index.ts` public surface).
- [x] Tests are written red before each production component/foundation implementation. Phases 0-3 followed vertical red-green slices per `design.md`/`decision.md`; the DEC-013 radius-override correction and REQ-003/REQ-005 gap closure in this session each started from a reproducing failing test (axe violations reproduced via `bun catalog:test`, missing-export reproduced via a new `package-contract.test.ts` case, Sonner theme mismatch reproduced via `pilot-sonner.test.tsx`) before the corresponding source fix.
- [x] Package boundary, accessibility, visual, packed client, and SSR checks remain separate required gates (`bun boundary`, compact `bun catalog:test` accessibility contracts, `bun catalog:test:visual` screenshots, `bun cmd/verify-package.ts` client+SSR, all run independently — see Phase 4 verification log in `task.md`).

## API

The implemented public API (`app/component/brand/stylex/theme.tsx`, `button.tsx`, `calendar.tsx`, `ticket-card.tsx`):

```tsx
type ThemeMode = "light" | "dark" | "cue" | "future"
function useThemeMode(): ThemeMode // public seam for portal-rendered consumers (e.g. Sonner)

type ButtonSize = "default" | "xs" | "sm" | "lg" | "xl" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

// Calendar forwards react-day-picker's controlled contract directly (DEC-010):
// mode="single" | selected: Date, onSelect: (date) => void
// mode="range"  | selected: DateRange, onSelect: (range) => void

type TicketCardProps = React.ComponentProps<"article"> & {
  children: React.ReactNode
  side?: "front" | "back"
  defaultSide?: "front" | "back"
  onSideChange?: (side: "front" | "back") => void
  frontLabel: string
  backLabel: string
}
```

## Phase 3 current implementation

Receipt, StatusStamp, DetailItem, SettingItem, StickyAlert, SuccessBurst, ResponsiveImage, ProductItem/QuantityStepper, TicketCover, TicketCard, and QrCode are implemented as StyleX presentation components with root and direct exports. Every family has a `default.tsx` catalog example, and the text-sensitive families (Receipt, StatusStamp, DetailItem, SettingItem, StickyAlert) additionally have a `states.tsx` example covering long copy, Thai copy, and tone/disabled variants. QrCode wraps `react-qr-code` (the same library Cue uses for PromptPay and ticket QR) with brand-safe defaults (`bgColor="transparent"`, `fgColor="currentColor"`, `level="H"`); the underlying primitive derives its own `viewBox` from the QR module grid, so `size` is the caller-facing rendered-dimension control, not `viewBox`. Packed tarball, client, and SSR verification cover all Phase 3 exports (`bun cmd/verify-package.ts`).

## Non-Goal

- Consumer migration, local duplicate deletion, application routing, container state, data access, authorization, product DTO mapping, product i18n, release publication, or theme persistence policy.
