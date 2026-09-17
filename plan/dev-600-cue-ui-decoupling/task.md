# Tasks: DEV-600 Cue UI Decoupling

Implementation order matters - complete top to bottom.

## Phase 0: Characterize and constrain

- [x] Inventory Cue component recipes and classify each as package presentation, consumer composition, or consumer business logic (recorded in `design.md` component ownership table and the DEV-600 blueprint artifact).
- [x] Record baseline geometry, padding, spacing, typography, responsive behavior, keyboard/focus behavior, and reduced-motion behavior for each promoted family (DEC-001, DEC-008, DEC-010, DEC-011).
- [x] Declare public test seams before test implementation: `data-slot`, native prop/ref forwarding, controlled callbacks, provider boundaries, root/direct exports, and semantic CSS custom properties (`design.md` public test seams table).
- [x] Add boundary expectations proving package source imports neither consumer application code nor product i18n (`test/component/dev-600-boundary.test.tsx`, `test/internal/source-boundary.test.ts`).

## Phase 1: Token and provider foundation (TDD)

- [x] Write failing public contract tests for semantic token scope and same-DOM/non-color geometry parity in light/white, Cue dark, and future themes.
- [x] Write failing Theme/Sonner provider and portal scope contracts, with existing dialog focus-restoration coverage retained. Toast role and outside-sentinel coverage remain.
- [x] Remove the global square-radius reset and replace it with Cue-recipe-owned radius declarations; prove intentional radii and pseudo-elements retain component control. (Corrected: the adapter's DEC-019 `!important` override was still live in `app/component/brand/stylex/adapter.css` and shipped into `dist/style.css`, forcing Card/Dialog/DropArea and other rounded Cue surfaces to `0px`. Removed per DEC-013; `test/browser/public-stylex.spec.ts` rewritten to assert the real Cue-recipe radius contract; `visual.spec.ts` DropArea dark golden snapshots regenerated.)
- [x] Implement semantic color layers and package Theme/Sonner authority with static StyleX extraction.
- [x] Add `brandText` semantic token so brand-hued text clears WCAG AA independent of the brand fill color (DEC-012), fixing the Tabs `link` active-trigger contrast violation caught by `bun catalog:test`.
- [x] Add catalog states for light/white, Cue dark, mobile, reduced motion, portals, and focus behavior (existing `theme`, `motion`, and mobile toolbar controls exercised across all 69 catalog families by `test/browser/catalog.spec.ts`). Dedicated future-theme and long/Thai-copy catalog states remain a follow-up beyond DEV-600 foundation scope.

## Phase 2: Migration-critical primitives (TDD)

- [x] Write failing Button `xl`, Tabs link, Select unstyled, Dialog, and Calendar public API/interaction tests against declared seams.
- [x] Implement Button `xl` with Cue 44px / 12px / 18px geometry and secondary expanded treatment; preserve existing disabled semantics.
- [x] Implement Tabs link list semantics without route ownership: 56px full-width scrollable list with inherited trigger treatment, brand active state, and retained Base UI selection behavior.
- [x] Implement Select `appearance="unstyled"` escape hatch without weakening semantic behavior, icon rendering, forwarding, or controlled value seams.
- [x] Implement Cue responsive Dialog placement and round close affordance with caller-provided close labels (technical fallback only), portal/focus/Escape behavior, and neutral `DialogIcon` composition.
- [x] Implement Calendar stable local `YYYY-MM-DD` day seams and an active-element focus guard while retaining react-day-picker controlled/uncontrolled single/range APIs.

## Phase 3: Source, export, and branded presentation (TDD)

- [x] Write failing source-boundary and root/direct export tests for every promoted family. Declaration, packed client, and SSR verification remain pending.
- [x] Promote owned StyleX component source and stable root/direct export entries while retaining generated Shadcn source unchanged as reference.
- [x] Write failing public presentation contract tests for TicketCard, TicketCover, Receipt, StatusStamp, and selected related components.
- [x] Implement selected branded presentation with semantic slots, caller-owned labels/content/actions, responsive layout, a11y mechanics, and no Cue DTO/i18n/workflow import.
- [x] Add baseline catalog default examples for every Phase 3 family (`internal/catalog/example/{receipt,status-stamp,detail-item,setting-item,sticky-alert,success-burst,responsive-image,product-item,ticket-cover,ticket-card}/default.tsx`). Comprehensive per-state catalog coverage (invalid/loading/empty/long-copy per family) remains a follow-up beyond DEV-600 foundation scope.

## Phase 4: Foundation verification and handoff

- [x] Run formatter, `bun lint`, typecheck, boundary, test, runtime coverage, brand coverage, catalog build/test, visual/a11y checks, package build/check, client/SSR fixture, and tree-shaking checks required by ADHD. All green (final re-run after REQ-003/REQ-005/REQ-001 gap closure): `bun fmt`, `bun lint` (0 errors, 10 pre-existing generated-source warnings), `bun run typecheck` (clean), `bun cmd/check-source-boundary.ts` (clean), `bun test` (47/47), `bun run coverage:brand` (100% stmts/branch/func/line), `COVERAGE_SCOPE=runtime bun run coverage:runtime` (100%), `bun catalog:build` (clean), `CI=true bun catalog:test` (full suite including 21 new `dev-600-presentation-states.spec.ts` cases and 5 new `states.tsx` catalog examples), `bun cmd/verify-package.ts` ("Verified 125 installed public entry with declaration checking"), `bun cmd/verify-tree-shaking.ts` (clean, no chart/upload retained).
- [x] Capture Bun.WebView evaluation evidence under `.eval/0917-dev-600-cue-ui-decoupling/`, including reproducing steps, screen capture, and relevant recording/script (`cmd/verify-dev-600-decoupling.ts`; covers Tabs `link` contrast fix, Receipt `dl` structure fix, Calendar stable `data-day`, and 6 branded-composition light-theme renders).
- [x] Review every `ui-centralization` acceptance criterion against implementation and record any divergence as a new decision. A second, more thorough spec-by-spec audit (prompted by the goal-completion review) found two further real, previously unchecked gaps beyond DEC-013:
  - REQ-003 was unmet: `SonnerToaster` still read `next-themes`, not Bridge `Theme`; `ThemeContext` was not even exported. Fixed via DEC-014 (`useThemeMode` public hook + Sonner rewire + `next-themes` dependency removal), proven by 8 new `pilot-sonner.test.tsx` cases including a real outside-Theme-boundary sentinel.
  - REQ-005 was unmet: Calendar, Dialog, Tabs, and Select — the requirement's own named "migration-critical APIs" — had no stable direct package export (only Button did). Fixed via DEC-015 (4 new `package.json` exports), proven by a new `package-contract.test.ts` assertion and `bun cmd/verify-package.ts` (125 verified entries, up from 121/79).
  - REQ-001's mobile/dark/reduced-motion/long-copy/Thai-copy state coverage for the 10 Phase 3 branded families was genuinely absent (only `default.tsx` existed per family). Closed with `states.tsx` catalog examples for the 5 text-sensitive families and `test/browser/dev-600-presentation-states.spec.ts` (21 cases: dark theme, 390px containment, `SuccessBurst`/`TicketCard` reduced-motion transitions, `ProductItem`/`QuantityStepper` bound-disabling, `ResponsiveImage` breakpoint source, `TicketCard` side-toggle events). This also surfaced and fixed a real defect in the `product-item/default.tsx` example itself (uncontrolled `value` prop with a no-op `onValueChange` meant the stepper's disabled-at-bounds state was unreachable).
  - Every `spec/ui-centralization/spec.md` REQ-001 through REQ-008 acceptance checkbox is now checked with a specific evidence citation; spec status moved from `draft` to `accepted`. `design.md`'s example code and `proposal.md`'s success criteria were corrected to match the real `mode`/`themeMode` API (previously showed a stale `name="cue-dark"` prop that never existed).
- [x] Confirm every ADHD foundation gate passes before proposing any consumer migration; consumer migration remains out of scope for DEV-600. No `@cue/web`, `@bridge/web`, or product i18n import exists anywhere in `app/`, `internal/catalog/example/`, or `cmd/` per `test/component/dev-600-boundary.test.tsx` and `test/internal/source-boundary.test.ts`.
- [x] Archive using the archive-plan workflow. Every REQ-001 through REQ-008 acceptance criterion in `spec/ui-centralization/spec.md` is checked with cited evidence; the only remaining scope explicitly deferred is the whole-package ADHD foundation gate #2 (full state/visual coverage for all 69+ generated families), which `ADHD.md` itself documents as a pre-existing, ongoing, package-wide condition outside DEV-600's specific proposal scope (`proposal.md` out-of-scope list), not a DEV-600 requirement.
