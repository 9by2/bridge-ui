# Ordered Implementation Handoff

All implementation remains unchecked. This plan has not authorized a 70-module rewrite. Effort is relative: W1 medium/high; W3 and W5 high due context/engine boundary; no calendar estimate before pilot measurement.

## W0: Freeze And Approve

- [ ] Fetch without overwriting unrelated work; identify RC.1 release source SHA, package integrity, lockfile and Bun/Node/browser version. Local `7150c06` is not assumed to equal RC.1.
- [ ] Preserve Web report, source fixture and screenshot as immutable baseline; record current mixed-chart and overflow failure separately from the pilot pass.
- [ ] Generate AST export and compound-slot inventory from all 70 module files; reconcile alias/helper/type/hook exports with packed entry enumeration.
- [ ] Approve owned-port strategy, caller override/variant-helper contract, scoped theme/portal behavior, optional global/font CSS split and any public Theme/API addition.
- [ ] Verify installed StyleX 0.19 support for defineVars, createTheme, state/marker selector and runtime variable; align Bun/Vite CSS layer option or document proven equivalence.
- [ ] Reconcile parent foundation plan's stale coverage wording with current ADHD, without deleting open foundation work or claiming old unchecked work newly verified.

## W1: Bounded Experiment

- [ ] Add failing parity test for Button variant/size/render/ref/event/helper behavior before adding owned Button.
- [ ] Add failing Field/Input test for htmlFor, required/invalid state, native form and error deduplication; include owned Label/Separator dependency support.
- [ ] Add failing Dialog test for controlled state, portal theme, nested scope, focus/scroll cleanup, close-label API and render-composed Button.
- [ ] Add internal token/theme extraction test and decide scoped Theme surface; implement the smallest approved token/portal mechanism.
- [ ] Implement owned pilot over the current primitive engine; never hand-edit `app/component/shadcn/`.
- [ ] Build A/B catalog view using identical prop/content/dimension and expose all supported pilot slot/state; keep shipping export unchanged until review.
- [ ] Capture light/dark at 390/1280 plus RTL, reduced motion, focus/open/invalid/disabled and long/Thai content. Record computed token and element bounds.
- [ ] Build a Tailwind-free candidate fixture without a consumer StyleX plugin; execute production SSR then hydrate it with zero recoverable error.
- [ ] Compare candidate JS/gzip/CSS/font/load impact against frozen same-content baseline. Preserve 18,000-byte gzip Button budget; quantify shared CSS rather than promising per-component CSS tree shaking.
- [ ] Review pilot. Stop if selector emulation needs broad CSS, provider identity changes, override contract breaks, accessibility regresses or CSS cannot be isolated as approved.

## W2: Presentation And Form

- [ ] After pilot approval, port every W2 matrix row in dependency order: support surface -> button group/item/input group -> control -> DropArea.
- [ ] Use red-green component test per family, including public string helper compatibility; maintain 100% owned coverage.
- [ ] Introduce export promotion for the accepted family: root/direct/wildcard entry map to one owned implementation; retain generated source unchanged as reference.
- [ ] Repeat packed compile/render/hydration and visual/style-leak test with both import paths; update exact per-row status and evidence link.

## W3: Overlay And Provider

- [ ] Port complete overlay family after Dialog; preserve engine portal/positioner/ref geometry and nested theme inheritance.
- [ ] Port Select/Combobox/Command then MultiSelect and owned MultiSelectValue together; preserve controlled state and item registration.
- [ ] Port ToggleGroup and InputOTP context tree; add mixed-root/direct identity and missing-provider diagnostic.
- [ ] Port menu family after DropdownMenu; add pointer, keyboard, submenu and hidden focus-sentinel manual review.
- [ ] Port Toast and Sonner separately; retain both Toaster names/ownership and caller theme behavior without adding app persistence.
- [ ] Rerun context fixture with nested opposite theme, portal within portal, Escape/focus return, timer/listener cleanup and unmount while open.

## W4: Compound Layout

- [ ] Port all W4 matrix rows: accordion/collapsible/tabs/navigation, sidebar, table/scroll/resize/carousel and conversation/questionnaire.
- [ ] Preserve Direction provider identity without adding styling to a behavior-only module.
- [ ] Close selector-heavy gap through owned marker/slot or reviewed scoped adapter; no utility-string runtime converter.
- [ ] Test Sidebar cookie/shortcut contract, carousel reInit/select disposal, message scroll anchoring and questionnaire callback order.
- [ ] Add mobile geometry for narrow nested grid, scrolling panel and portal; isolate pre-existing Web overflow before assigning correction ownership.

## W5: Engine And Media

- [ ] Decide Recharts dependency contract using positive v3 and negative mixed-v2 fixture. Do not conflate this fix with CSS conversion or use dedupe as published proof.
- [ ] Port Chart and Calendar through documented engine slot API, allowlisting any scoped adapter; review runtime config CSS/CSP strategy.
- [ ] Test all 16 chart and 190 TsChart catalog files for continued render; add real mark/tooltip/legend/resize behavior beyond SVG visibility.
- [ ] Preserve TsChart paired engine and renderer API; do not create StyleX work in a wrapper that has no owned styling unless a measured need exists.
- [ ] Convert UploadPreview/Viewer/List and ImageCrop after their primitive dependency; run MIME, transfer, media fallback, bitmap lifecycle and crop geometry matrix.

## W6: Consolidate And Release

- [ ] Audit all 70 rows and every exported slot/helper/hook; document a justified no-style or third-party adapter exception instead of claiming 100% StyleX by file count.
- [ ] Remove Tailwind dependency from promoted owned runtime and from the candidate-only fixture; remove package-wide Tailwind only after every generated/runtime consumer of it is retired from supported output.
- [ ] Preserve shipped path continuity through explicit exports; exclude unneeded generated runtime from published output only after verifying no supported path points to it.
- [ ] Activate approved component/global/font CSS contract; run CSS before/after sentinel outside scope in both load orders, including same document mixed theme and portal.
- [ ] Run complete validation sequence in acceptance spec; do not archive a failing gate.
- [ ] Add Changeset with styling/API/CSS/dependency contract impact; reviewed feature merge -> bot release MR -> reviewed RC merge -> registry install proof.
- [ ] Rerun the unchanged baseline Web probe against exact RC, adding positive compatible-chart coverage rather than deleting the known negative probe; record full app/CI proof as separate scope.
- [ ] Review every ADHD foundation gate before proposing Web migration or stable `latest`; Cue follows Web only after its own approval.
- [ ] Archive this proposal and sync active spec with archive-plan only when the approved scope is complete; keep deferred wave in an explicit successor proposal if scope is narrowed.
