# Wizard Step

**Proposal:** `wizard-step`
**Status:** in-progress
**Phase:** [ADHD.md](../../ADHD.md) — StyleX Bundle / reusable presentation family (same tier as `TimelineStep`)

## Problem

`@bridge/ui` ships `TimelineStep` for vertical/horizontal activity-feed
presentation, but has no component for the distinct multi-step **wizard
header** pattern used in onboarding, checkout, and setup flows. Mobbin
research across 13 production apps (Workable, Deel, ElevenLabs, Xero,
Zillow, Deputy, Klaviyo, Melio, Arcade, Relevance AI, Etsy, Brilliant, YNAB)
confirms this is a distinct, near-universal UI pattern:
[artifact reference](https://artifact.9by2.workers.dev/artifact/01a0c233-6789-7743-a4ee-5e6dea1a43fc/).

`TimelineStep` cannot serve this need without forking its layout: it is
content-forward (vertical feed, connector behind a tall content block,
`marginInlineStart: 52`), while a wizard header is chrome-forward (compact
row, content lives in a separate panel). Per `ADHD.md`, "primitive
implementation must not fork" — so this is a new, sibling component that
reuses `TimelineStep`'s token vocabulary and state grammar rather than
extending it.

## Scope

### In scope

- New `WizardStep` StyleX component family at
  `app/component/brand/stylex/wizard-step.tsx`: `WizardStep`,
  `WizardStepItem`, `WizardStepIndicator`, `WizardStepConnector`,
  `WizardStepLabel`, `WizardStepTitle`, `WizardStepDescription`,
  `WizardStepCounter`.
- `orientation` (`horizontal` default, `vertical`), `variant` (`number`
  default, `dot`, `line`), `tone` (`hard` default, `soft`) on `WizardStep`.
- `state` (`upcoming` default, `current`, `completed`, `error`) on
  `WizardStepItem` / `WizardStepIndicator` / `WizardStepConnector` — adds
  `error` beyond `TimelineStepState`.
- `useRender`-based `WizardStepItem` so a `completed` step can become an
  interactive `<button>`/`<a>` via `render`, matching the `Marker`/`Item`
  pattern.
- Root (`app/index.ts`) and stable direct package export
  (`./wizard-step` in `package.json`), mirroring `timeline-step`.
- Component catalog example(s) at
  `internal/catalog/example/wizard-step/default.tsx` (+ a `states.tsx`
  covering every variant/orientation/tone/state combination, long copy,
  and Thai copy) satisfying the catalog inventory contract
  (`test/internal/catalog.test.ts`).
- Component test at `test/component/wizard-step.test.tsx` covering native
  prop/ref pass-through, every `data-slot`, `data-state`/`data-variant`
  attribute, the `error` state, and the completed-step `render` override.
- Focused browser verification (dark theme, 390px mobile, reduced motion,
  horizontal overflow containment) added to
  `test/browser/dev-600-presentation-states.test.ts` or a new focused file
  following the existing pattern.
- Package contract test updates
  (`test/internal/package-contract.test.ts`) asserting the new root/direct
  export.
- Changeset for a minor release.

### Out of scope

- Any consumer (Bridge Web / Cue) migration or adoption — package-only,
  per ADHD's foundation-first rule.
- Editorial/large-number variant (Arcade reference) — noted in research as
  out of scope for the core primitive.
- Business logic: active-step index ownership, step validation rules,
  routing between steps, and copy/i18n stay with the consuming
  application container per `ADHD.md`'s state-ownership boundary.
- Changing or extending `TimelineStep` itself.

## Success Criteria

- [x] `WizardStep` family renders every documented `data-slot`,
      `data-state`, and `data-variant` attribute.
- [x] `error` state renders a distinct destructive-tone indicator not
      present on `TimelineStepState`.
- [x] Completed `WizardStepItem` accepts a `render` prop to become
      interactive; `upcoming`/`current`/`error` remain non-interactive.
- [x] Horizontal orientation contains overflow; vertical reuses a
      flex-flow connector geometry (see DEC-006 — simplified from the
      original `TimelineStepConnector` absolute-position approach because
      `WizardStep`'s flex-row item layout doesn't share `TimelineStep`'s
      block-stacked geometry).
- [x] Root and stable direct (`@bridge/ui/wizard-step`) export resolve in
      packed client/SSR fixtures.
- [x] `internal/catalog/example/wizard-step/default.tsx` and `states.tsx`
      exist, satisfy the catalog inventory test, and cover dark, mobile,
      long-copy, and Thai-copy states.
- [x] 100% statement/branch/function/line coverage on the new
      non-Shadcn component (ADHD Quality gate).
- [x] Formatter, lint, typecheck, boundary, `bun test`, brand/runtime
      coverage, catalog build + `catalog:test`, package build, packed
      client/SSR, and tree-shaking all pass.

## Specs

| Spec        | Path                       | Summary                                                                  |
| ----------- | -------------------------- | ------------------------------------------------------------------------ |
| wizard-step | `spec/wizard-step/spec.md` | API contract, states, tokens, and acceptance for the `WizardStep` family |

## References

- [Steps wizard component prototype (Mobbin research + interactive prototype)](https://artifact.9by2.workers.dev/artifact/01a0c233-6789-7743-a4ee-5e6dea1a43fc/)
- `app/component/brand/stylex/timeline-step.tsx` — sibling component, shared token vocabulary
- `plan/spec/reusable-presentation/spec.md` — prior art for this presentation-family shape
- `plan/archived/20260917-dev-596-centralization/` — precedent proposal for adding a reusable presentation family
