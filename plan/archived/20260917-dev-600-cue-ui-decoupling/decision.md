# Decisions: DEV-600 Cue UI Decoupling

| ID      | Title                                                  | Status   |
| ------- | ------------------------------------------------------ | -------- |
| DEC-001 | Cue recipes are canonical                              | accepted |
| DEC-002 | StyleX owns reusable presentation                      | accepted |
| DEC-003 | Themes are semantic color layers                       | accepted |
| DEC-004 | Product i18n stays outside package                     | accepted |
| DEC-005 | Ticket-named presentation remains reusable             | accepted |
| DEC-006 | DEV-600 supersedes square-corner assumption            | accepted |
| DEC-007 | Public seams precede tests                             | accepted |
| DEC-008 | Shape belongs to semantic component recipes            | accepted |
| DEC-009 | Theme names preserve mode compatibility                | accepted |
| DEC-010 | Phase 2 primitive compatibility contracts              | accepted |
| DEC-011 | Phase 3 presentation contract boundary                 | accepted |
| DEC-012 | `brandText` pairs brand fill with safe text            | accepted |
| DEC-013 | Remove live DEC-019 global radius override             | accepted |
| DEC-014 | Sonner reads Bridge Theme authority, not `next-themes` | accepted |
| DEC-015 | Migration-critical primitives get direct exports       | accepted |

---

### DEC-001: Cue recipes are canonical

**GIVEN** Cue has mature geometry, padding, spacing, typography, responsive behavior, and accessibility behavior
**WHEN** `@bridge/ui` centralizes a reusable component
**THEN** characterize Cue’s recipe first and preserve it as the canonical package recipe unless a later reviewed decision changes it.

---

### DEC-002: StyleX owns reusable presentation

**GIVEN** the package must produce static portable CSS
**WHEN** reusable presentation is promoted
**THEN** owned StyleX source implements visual and accessibility mechanics while consumer code owns data and business workflows.

---

### DEC-003: Themes are semantic color layers

**GIVEN** light/white, Cue dark, and future themes must use the same component contract
**WHEN** a theme changes
**THEN** it changes semantic color token values only; DOM, geometry, spacing, typography, and responsive structure remain equivalent.

---

### DEC-004: Product i18n stays outside package

**GIVEN** translations are repository and product owned
**WHEN** a package component needs visible language
**THEN** consumers provide translated children, labels, formatters, and message content; `@bridge/ui` never imports, owns, or publishes product i18n.

---

### DEC-005: Ticket-named presentation remains reusable

**GIVEN** TicketCard, TicketCover, Receipt, StatusStamp, and related components may express reusable ticket presentation
**WHEN** they are package candidates
**THEN** the package owns presentation/a11y mechanics even with ticket naming, but accepts no consumer DTO, query, route, product copy, or workflow.

---

### DEC-006: DEV-600 supersedes square-corner assumption

**GIVEN** `stylex-public-promotion` DEC-006 imposes a global square-corner invariant that rejects Cue’s canonical recipes
**WHEN** DEV-600 defines the centralized visual baseline
**THEN** DEV-600 supersedes that rejected square-corner assumption only; intentional Cue component radii remain recipe-owned. The stale active plan is not edited by this proposal.

---

### DEC-007: Public seams precede tests

**GIVEN** migration-critical behavior must be tested without consumer fixtures
**WHEN** implementation begins
**THEN** first define stable `data-slot`, forwarding, controlled-state, provider, export, and semantic-token seams, then write failing public contract tests against them.

---

### DEC-008: Shape belongs to semantic component recipes

**GIVEN** global descendant selectors override consumer markup and erase component intent
**WHEN** DEV-600 replaces the rejected square-corner invariant
**THEN** static StyleX shape tokens provide control and floating-surface radii; components select them explicitly. CTA stays square and avatar/capsule behavior stays intentional. The scoped adapter has no broad `!important` radius selector.

---

### DEC-009: Theme names preserve mode compatibility

**GIVEN** public callers already use `mode="light" | "dark" | "cue"`
**WHEN** adding the next visual layer
**THEN** `Theme` accepts either existing `mode` or API-compatible `name`, and adds `future` without changing DOM or non-color geometry. Sonner reads the nearest Bridge Theme and maps `light` to Sonner light and `dark`/`cue`/`future` to Sonner dark.

---

### DEC-010: Phase 2 primitive compatibility contracts

**GIVEN** Cue’s migration-critical primitive recipes need package ownership without consumer or translation dependencies
**WHEN** DEV-600 Phase 2 promotes Button, Tabs, Select, Dialog, and Calendar compatibility
**THEN** Button `xl` is 44px high with 12px inline padding and 18px text; link Tabs derive their visual behavior from the parent list `data-variant`; Select accepts `appearance="default" | "unstyled"` while retaining primitive semantics and its icon; Dialog exposes caller-supplied close labels with only a technical `dialog-close` fallback and a neutral `DialogIcon`; Calendar exposes local `YYYY-MM-DD` data-day values and only claims focus when nothing else owns active focus. Product strings, routes, i18n, consumers, and generated source remain outside this work.

---

### DEC-011: Phase 3 presentation contract boundary

**GIVEN** Phase 3 promotes reusable Cue-derived visual compositions
**WHEN** implementing Receipt, StatusStamp, DetailItem, SettingItem, StickyAlert, SuccessBurst, ResponsiveImage, ProductItem, TicketCover, and TicketCard
**THEN** every component keeps content, accessible labels, media/source construction, status policy, quantity value, and ticket side controlled by the caller; the package supplies only semantic slots, StyleX presentation, reduced-motion mechanics, and stable root/direct exports. Phase completion remains pending catalog-state and packed client/SSR verification.

---

### DEC-012: `brandText` token pairs the brand fill with a text-safe value

**GIVEN** Cue's own design record marks saturated brand-accent fills as fill-only and never legal as unpaired text color, and the catalog accessibility gate (`bun catalog:test`) caught exactly this violation on the Tabs `link` active-trigger color (1.3:1 contrast against a white background, failing the 4.5:1 WCAG AA minimum)
**WHEN** a component needs the brand hue as foreground/text color instead of as a fill
**THEN** `token.stylex.ts` and every `Theme` mode declare a dedicated `brandText` custom property, calibrated per theme so it always clears WCAG AA against that theme's card/background/popover surface; components select `token.brandText` for text color and reserve `token.brand` for fills, following the same pattern already established by `errorText`/`destructiveText` versus `destructive`. Tabs `link` active-trigger color is the first consumer of this token.

---

### DEC-013: Remove the live DEC-019 global square-corner override

**GIVEN** `app/component/brand/stylex/adapter.css` still shipped a `stylex-public-promotion` DEC-019 rule (`:where([data-pilot-theme] [data-slot], ... *) { border-radius: 0 !important; }`) into the published `dist/style.css`, forcing Card, Dialog, DropArea, and every other rounded Cue-recipe surface (and arbitrary caller-owned descendant content) to `0px` despite DEC-001/DEC-006/DEC-008 establishing Cue's rounded recipe as canonical
**WHEN** DEV-600 Phase 1 claims the global reset is replaced by Cue-recipe-owned radius declarations
**THEN** delete the DEC-019 selector block entirely. Every component that legitimately needs a square or pill shape already self-declares it in its own StyleX source (Button `cta`/multi-select-trigger, Tabs `link`/`multi-select` triggers, Avatar/Badge/capsule-tab pill radii), so removing the global override is safe with zero remaining consumer besides `internal/catalog/pilot.css`'s import of the same file. `test/browser/public-stylex.spec.ts` is rewritten to assert Cue's actual recipe (rounded-by-default Button/Card, square CTA, pill Avatar, and untouched caller host content) instead of a blanket zero-radius invariant. `test/browser/visual.spec.ts-snapshots/drop-area-dark-*.png` golden images are regenerated because DropArea's self-declared `borderRadius: 14` (Cue `radius-xl`) now renders correctly instead of being force-zeroed.

---

### DEC-014: Sonner reads Bridge Theme authority, not `next-themes`

**GIVEN** DEC-009 requires Sonner to read the nearest Bridge `Theme` mode and map `light`→Sonner light and `dark`/`cue`/`future`→Sonner dark, but `SonnerToaster` still called `useTheme()` from `next-themes`, an external provider the package's own `Theme` component never populates, and `ThemeContext` was not exported so nothing could observe the current mode from outside `theme.tsx`
**WHEN** REQ-003's audited acceptance ("Toast role, keyboard/focus restoration, portal scope, and outside sentinel behavior are verified") is proven against real evidence
**THEN** `theme.tsx` exports a public `useThemeMode()` hook reading `ThemeContext`; `sonner.tsx` drops the `next-themes` import and dependency entirely and calls `useThemeMode()`, mapping via `mode === themeMode.light ? "light" : "dark"`; an explicit caller `theme` prop still wins. `test/component/pilot-sonner.test.tsx` proves the four-mode mapping, the no-ancestor default, the explicit-override path, and an outside-Theme-boundary sentinel (a sibling `Theme mode="cue"` node does not leak into an unrelated `Toaster`'s resolved mode). `next-themes` is removed from `package.json` dependencies as it has no remaining owned-source consumer.

---

### DEC-015: Migration-critical primitives get direct exports

**GIVEN** REQ-005 explicitly requires Button `xl`, Tabs link semantics, Select unstyled, and Dialog accessible portal/focus behavior to each have "a stable root and direct package export plus declaration coverage," but only `./button` existed in `package.json`; Calendar, Dialog, Tabs, and Select were reachable only via the root barrel or the implementation-shaped `./component/shadcn/*` wildcard
**WHEN** REQ-005's acceptance is proven against real evidence
**THEN** add `./calendar`, `./dialog`, `./tabs`, `./select` to `package.json` exports, each pointing at the existing per-file build output already produced by `cmd/build-package.ts` (owned StyleX source is already built as separate entries; only the manifest mapping was missing). `test/internal/package-contract.test.ts` adds a dedicated assertion for all five migration-critical direct exports, and `bun cmd/verify-package.ts` proves every one resolves from an installed tarball with declaration checking (125 installed public entries verified, up from 121).
