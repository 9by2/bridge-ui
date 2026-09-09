# Ordered Implementation Handoff

Execution authorized on 2026-09-08 with Effect limited to tooling/resource boundaries and React/Base UI retained. Follow `phase-detail.md` for every W0-W6 slice, one red-green loop at a time. Public breaking change, registry publication and consumer migration remain gated. Effort is relative: W1 medium/high; W3 and W5 high; no calendar estimate before pilot measurement.

## W0: Freeze And Approve

- [ ] Fetch without overwriting unrelated work; identify RC.1 release source SHA, package integrity, lockfile and Bun/Node/browser version. Local `7150c06` is not assumed to equal RC.1.
- [ ] Preserve Web report, source fixture and screenshot as immutable baseline; record current mixed-chart and overflow failure separately from the pilot pass.
- [x] Generate AST named-export inventory from all 70 module files (388 value/type entries); verify built root/direct runtime identity with MultiSelectValue/Sonner exceptions. Packed entry verification separately passes; full declaration semantic resolution is not claimed.
- [x] Approve private owned pilot and scoped theme/portal experiment, preserving shipped helper/override and export/CSS behavior (DEC-009). Public Theme/API and CSS split remain deferred approval gates.
- [x] Verify installed StyleX 0.19 support for defineVars, createTheme, state/marker selector and runtime variable; align Bun/Vite CSS layer option or document proven equivalence.
- [ ] Reconcile parent foundation plan's stale coverage wording with current ADHD, without deleting open foundation work or claiming old unchecked work newly verified.

## W1: Bounded Experiment

- [x] Add failing behavior test for private Button variant/size/render/ref/event/helper before implementation; resting 96-case and focused hover/active/focus-visible comparison pass. Icon/expanded/ring parity remains part of pilot review.
- [x] Add failing Field/Input test for htmlFor, required/invalid state, native form and error deduplication; include owned Label/Separator dependency support.
- [x] Complete Dialog test matrix: controlled state, nested portal theme, Escape/focus return, unmount and render-composed Button pass; scroll cleanup and close-label API decision remain open.
- [x] Add internal token/theme extraction test and decide scoped Theme surface; implement the smallest approved token/portal mechanism.
- [x] Implement owned pilot over the current primitive engine; never hand-edit `app/component/shadcn/`.
- [ ] Complete A/B catalog state inventory. Initial isolated baseline/candidate page with identical content, Thai copy, theme/width control and form/dialog interaction is implemented and WebView-verified; not every slot/state is exposed yet.
- [ ] Capture light/dark at 390/1280 plus RTL, reduced motion, focus/open/invalid/disabled and long/Thai content. Record computed token and element bounds.
- [x] Build Tailwind-free self-contained candidate fixture; production SSR/hydration passes four WebView cases with no recoverable error. HTTP/CSP loading remains separate verification.
- [x] Compare candidate JS/gzip/CSS/font/load impact against frozen same-content baseline. Preserve 18,000-byte gzip Button budget; quantify shared CSS rather than promising per-component CSS tree shaking.
- [ ] Review pilot. Stop if selector emulation needs broad CSS, provider identity changes, override contract breaks, accessibility regresses or CSS cannot be isolated as approved.

## W2: Presentation And Form

- [x] Implement and verify W2.1 support surface under internal/pilot, then wire its full example inventory into /style-x.
- [x] Continue remaining W2-W5 candidate family with explicit per-module implementation and evidence; DEC-016 authorizes the full private scope.

- [ ] After pilot approval, port every W2 matrix row in dependency order: support surface -> button group/item/input group -> control -> DropArea.
- [x] Use red-green component test per family, including public string helper compatibility; maintain 100% owned coverage.
- [ ] Introduce export promotion for the accepted family: root/direct/wildcard entry map to one owned implementation; retain generated source unchanged as reference.
- [ ] Repeat packed compile/render/hydration and visual/style-leak test with both import paths; update exact per-row status and evidence link.

## W3: Overlay And Provider

- [x] Port complete overlay family after Dialog; preserve engine portal/positioner/ref geometry and nested theme inheritance.
- [x] Port Select/Combobox/Command then MultiSelect and owned MultiSelectValue together; preserve controlled state and item registration.
- [x] Port ToggleGroup and InputOTP context tree; add mixed-root/direct identity and missing-provider diagnostic.
- [x] Port menu family after DropdownMenu; add pointer, keyboard and submenu verification. Hidden focus-sentinel manual review remains a release review item.
- [x] Port Toast and Sonner separately; retain both Toaster names/ownership and caller theme behavior without adding app persistence.
- [ ] Rerun context fixture with nested opposite theme, portal within portal, Escape/focus return, timer/listener cleanup and unmount while open.

## W4: Compound Layout

- [x] Port all W4 matrix rows: accordion/collapsible/tabs/navigation, sidebar, table/scroll/resize/carousel and conversation/questionnaire.
- [x] Preserve Direction provider identity without adding styling to a behavior-only module.
- [x] Close selector-heavy gap through owned marker/slot or reviewed scoped adapter; no utility-string runtime converter.
- [x] Test Sidebar cookie/shortcut contract, carousel reInit/select disposal, message scroll anchoring and questionnaire callback order.
- [ ] Add mobile geometry for narrow nested grid, scrolling panel and portal; isolate pre-existing Web overflow before assigning correction ownership.

## W5: Engine And Media

- [ ] Decide Recharts dependency contract using positive v3 and negative mixed-v2 fixture. Do not conflate this fix with CSS conversion or use dedupe as published proof.
- [x] Port Chart and Calendar through documented engine slot API, allowlisting scoped adapter; runtime config CSS rejects unsafe color/key input and remains an explicit CSP adapter.
- [ ] Test all 16 chart and 190 TsChart catalog files for continued render; add real mark/tooltip/legend/resize behavior beyond SVG visibility.
- [x] Preserve TsChart paired engine and renderer API; unstyled wrapper retains exact implementation identity.
- [x] Convert UploadPreview/Viewer/List and ImageCrop after their primitive dependency; run MIME, transfer, media fallback, bitmap lifecycle and crop geometry matrix.

## W6: Consolidate And Release

- [x] Audit all 70 rows and every exported slot/helper/hook; document Direction/TsChart no-style identity and scoped descendant/engine adapter exceptions.
- [ ] Remove Tailwind dependency from promoted owned runtime and from the candidate-only fixture; remove package-wide Tailwind only after every generated/runtime consumer of it is retired from supported output.
- [ ] Preserve shipped path continuity through explicit exports; exclude unneeded generated runtime from published output only after verifying no supported path points to it.
- [ ] Activate approved component/global/font CSS contract; run CSS before/after sentinel outside scope in both load orders, including same document mixed theme and portal.
- [x] Run private candidate validation sequence: aggregate per-file coverage, catalog build, 69-family route, 276 default slot cases, 80 interactive cases, root geometry, reduced motion/RTL, open Axe, scoped isolation, budget, package build/install/tree-shaking. Release-only gates remain below.
- [ ] Add Changeset with styling/API/CSS/dependency contract impact; reviewed feature merge -> bot release MR -> reviewed RC merge -> registry install proof.
- [ ] Rerun the unchanged baseline Web probe against exact RC, adding positive compatible-chart coverage rather than deleting the known negative probe; record full app/CI proof as separate scope.
- [ ] Review every ADHD foundation gate before proposing Web migration or stable `latest`; Cue follows Web only after its own approval.
- [ ] Archive this proposal and sync active spec with archive-plan only when the approved scope is complete; keep deferred wave in an explicit successor proposal if scope is narrowed.

# StyleX Preview Route

- [x] Add /style-x using the same catalog inventory, navigation and example source; identify candidate versus generated fallback.
- [x] Verify direct route, iframe route, source disclosure, theme, mobile and dialog through regression and Bun.WebView.
