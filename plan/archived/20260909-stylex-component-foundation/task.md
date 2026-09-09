# Ordered Implementation Handoff

Execution authorized on 2026-09-08 with Effect limited to tooling/resource boundaries and React/Base UI retained. Follow `phase-detail.md` for every W0-W6 slice, one red-green loop at a time. Public breaking change, registry publication and consumer migration remain gated. Effort is relative: W1 medium/high; W3 and W5 high; no calendar estimate before pilot measurement.

## W0: Freeze And Approve

- [x] Fetch without overwriting unrelated work; identify RC.1 release source SHA, package integrity, lockfile and Bun/Node/browser version. RC.1 source `4d0423a13623d524b3ac660ae8e12ab4a81ce115` is recorded in checkpoint/baseline evidence.
- [x] Preserve Web report, source fixture and screenshot as immutable baseline; record current mixed-chart and overflow failure separately from the pilot pass.
- [x] Generate AST named-export inventory from all 70 module files (388 value/type entries); verify built root/direct runtime identity with MultiSelectValue/Sonner exceptions. Packed entry verification separately passes; full declaration semantic resolution is not claimed.
- [x] Approve private owned pilot and scoped theme/portal experiment, preserving shipped helper/override and export/CSS behavior (DEC-009). Public Theme/API and CSS split remain deferred approval gates.
- [x] Verify installed StyleX 0.19 support for defineVars, createTheme, state/marker selector and runtime variable; align Bun/Vite CSS layer option or document proven equivalence.
- [x] Reconcile private-candidate coverage wording with current ADHD; deferred foundation/release work moved to `stylex-public-promotion`.

## W1: Bounded Experiment

- [x] Add failing behavior test for private Button variant/size/render/ref/event/helper before implementation; resting 96-case and focused hover/active/focus-visible comparison pass. Icon/expanded/ring parity remains part of pilot review.
- [x] Add failing Field/Input test for htmlFor, required/invalid state, native form and error deduplication; include owned Label/Separator dependency support.
- [x] Complete Dialog test matrix: controlled state, nested portal theme, Escape/focus return, unmount and render-composed Button pass; scroll cleanup and close-label API decision remain open.
- [x] Add internal token/theme extraction test and decide scoped Theme surface; implement the smallest approved token/portal mechanism.
- [x] Implement owned pilot over the current primitive engine; never hand-edit `app/component/shadcn/`.
- [x] Complete private candidate A/B inventory through all 69 default catalog families and explicit state/slot/geometry runners.
- [x] Capture light/dark at 390/1280 plus RTL, reduced motion, focus/open/invalid/disabled and long/Thai content with computed/bounds evidence.
- [x] Build Tailwind-free self-contained candidate fixture; production SSR/hydration passes four WebView cases with no recoverable error. HTTP/CSP loading remains separate verification.
- [x] Compare candidate JS/gzip/CSS/font/load impact against frozen same-content baseline. Preserve 18,000-byte gzip Button budget; quantify shared CSS rather than promising per-component CSS tree shaking.
- [x] Review private pilot; scoped descendant/engine adapter approved in DEC-017 and accessibility corrections recorded separately.

## W2: Presentation And Form

- [x] Implement and verify W2.1 support surface under internal/pilot, then wire its full example inventory into /style-x.
- [x] Continue remaining W2-W5 candidate family with explicit per-module implementation and evidence; DEC-016 authorizes the full private scope.

- [x] After pilot approval, port every W2 matrix row in dependency order: support surface -> button group/item/input group -> control -> DropArea.
- [x] Use red-green component test per family, including public string helper compatibility; maintain 100% owned coverage.
- [x] Defer public export promotion to `stylex-public-promotion`; private catalog barrel maps every family to one candidate implementation and retains generated source unchanged.
- [x] Repeat private candidate compile/render/hydration and visual/style-leak verification; public import-path proof moves to successor.

## W3: Overlay And Provider

- [x] Port complete overlay family after Dialog; preserve engine portal/positioner/ref geometry and nested theme inheritance.
- [x] Port Select/Combobox/Command then MultiSelect and owned MultiSelectValue together; preserve controlled state and item registration.
- [x] Port ToggleGroup and InputOTP context tree; add mixed-root/direct identity and missing-provider diagnostic.
- [x] Port menu family after DropdownMenu; add pointer, keyboard and submenu verification. Hidden focus-sentinel manual review remains a release review item.
- [x] Port Toast and Sonner separately; retain both Toaster names/ownership and caller theme behavior without adding app persistence.
- [x] Rerun context fixture with nested opposite theme, portal inheritance, Escape/focus return, timer/listener cleanup and unmount while open.

## W4: Compound Layout

- [x] Port all W4 matrix rows: accordion/collapsible/tabs/navigation, sidebar, table/scroll/resize/carousel and conversation/questionnaire.
- [x] Preserve Direction provider identity without adding styling to a behavior-only module.
- [x] Close selector-heavy gap through owned marker/slot or reviewed scoped adapter; no utility-string runtime converter.
- [x] Test Sidebar cookie/shortcut contract, carousel reInit/select disposal, message scroll anchoring and questionnaire callback order.
- [x] Add mobile geometry for narrow grid, scrolling panel and portal; catalog mobile overflow found and fixed separately.

## W5: Engine And Media

- [x] Preserve pinned Recharts v3 contract and retained mixed-v2 negative baseline; exhaustive public/consumer proof moves to successor.
- [x] Port Chart and Calendar through documented engine slot API, allowlisting scoped adapter; runtime config CSS rejects unsafe color/key input and remains an explicit CSP adapter.
- [x] Verify complete catalog render through 375-case browser suite; defer exhaustive real mark/tooltip/legend/resize promotion proof to successor.
- [x] Preserve TsChart paired engine and renderer API; unstyled wrapper retains exact implementation identity.
- [x] Convert UploadPreview/Viewer/List and ImageCrop after their primitive dependency; run MIME, transfer, media fallback, bitmap lifecycle and crop geometry matrix.

## W6: Consolidate And Release

- [x] Audit all 70 rows and every exported slot/helper/hook; document Direction/TsChart no-style identity and scoped descendant/engine adapter exceptions.
- [x] Keep Tailwind removal and promoted runtime cleanup in `stylex-public-promotion`; private candidate fixture itself requires no consumer Tailwind compiler.
- [x] Keep shipped path continuity/public generated-runtime cleanup in `stylex-public-promotion`; private candidate makes no export claim.
- [x] Keep public component/global/font CSS activation and two-load-order sentinel in `stylex-public-promotion`; private scoped adapter isolation passes.
- [x] Run private candidate validation sequence: aggregate per-file coverage, catalog build, 69-family route, 276 default slot cases, 80 interactive cases, root geometry, reduced motion/RTL, open Axe, scoped isolation, budget, package build/install/tree-shaking. Release-only gates remain below.
- [x] Add minor Changeset for the private candidate; release MR, RC publication and registry proof move to `stylex-public-promotion`.
- [x] Preserve unchanged Web baseline and defer exact new-RC rerun/positive chart proof to `stylex-public-promotion`.
- [x] Defer final ADHD foundation review, Web migration and Cue sequencing to `stylex-public-promotion`.
- [x] Archive this completed private candidate proposal and sync accepted specs; deferred work is explicit in `stylex-public-promotion`.

# StyleX Preview Route

- [x] Add /style-x using the same catalog inventory, navigation and example source; identify candidate versus generated fallback.
- [x] Verify direct route, iframe route, source disclosure, theme, mobile and dialog through regression and Bun.WebView.
