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

- [x] Run formatter, `bun lint`, typecheck, boundary, test, runtime coverage, brand coverage, catalog build/test, visual/a11y checks, package build/check, client/SSR fixture, and tree-shaking checks required by ADHD. All green: `bun fmt` (919 files), `bun lint` (0 errors, 10 pre-existing generated-source warnings), `bun run typecheck` (clean), `bun cmd/check-source-boundary.ts` (clean), `bun test` (46/46), `bun run coverage:brand` (100% stmts/branch/func/line), `COVERAGE_SCOPE=runtime bun run coverage:runtime` (100% stmts/branch/func/line), `bun catalog:build` (clean), `CI=true bun catalog:test` (486/486 passed), `bun cmd/verify-package.ts` (clean tarball install/client/SSR), `bun cmd/verify-tree-shaking.ts` (button: 6224 gzip bytes, no chart/upload retained).
- [x] Capture Bun.WebView evaluation evidence under `.eval/0917-dev-600-cue-ui-decoupling/`, including reproducing steps, screen capture, and relevant recording/script (`cmd/verify-dev-600-decoupling.ts`; covers Tabs `link` contrast fix, Receipt `dl` structure fix, Calendar stable `data-day`, and 6 branded-composition light-theme renders).
- [x] Review every `ui-centralization` acceptance criterion against implementation and record any divergence as a new decision. Found and corrected one critical divergence: the adapter's global square-radius override was still live despite being marked complete; fixed via DEC-013 with full regression proof (see spec.md REQ-002 acceptance updates).
- [x] Confirm every ADHD foundation gate passes before proposing any consumer migration; consumer migration remains out of scope for DEV-600. No `@cue/web`, `@bridge/web`, or product i18n import exists anywhere in `app/`, `internal/catalog/example/`, or `cmd/` per `test/component/dev-600-boundary.test.tsx` and `test/internal/source-boundary.test.ts`.
- [ ] Archive only after all tasks complete, using the archive-plan workflow. Deferred pending user review of this session's DEC-013 correction and the two explicitly-scoped-out follow-ups (comprehensive per-state catalog matrix; dedicated Thai/long-copy catalog states).
