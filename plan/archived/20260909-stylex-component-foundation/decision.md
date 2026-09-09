# Decision And Approval Record

## DEC-016: Full Candidate Implementation

**GIVEN** the user explicitly requests every component in StyleX after reviewing the four-family preview.
**WHEN** continuing W2-W5.
**THEN** implement the full private candidate inventory in dependency order, retaining React and primitive behavior. Expand /style-x as each family passes verification. This authorizes continued implementation, not publication or an implicit public export switch. Never disguise generated fallback as migrated or convert utility strings at runtime.

## DEC-015: Parallel Catalog Route

**GIVEN** the user approves continuing the approach and requests /style-x listing the same catalog.
**WHEN** previewing the private implementation.
**THEN** reuse the existing inventory and source with catalog-only import substitution for Button/Input/Field/Dialog. Label generated fallback, retain utility layout CSS and regular route, and do not promote package export implicitly.

## DEC-014: Regular Preview Contrast Fix

**GIVEN** the user reports unreadable secondary Button text in the regular preview, which still consumes public theme CSS.
**WHEN** correcting that reported defect.
**THEN** change only light --secondary-foreground to oklch(0.985 0 0) in owned global.css. Preserve dark override and generated source. The built public Button WebView contrast regression must fail before and pass after the correction for rest, hover and focus-visible in both themes. This narrow bug fix does not promote the private pilot.

## DEC-013: Private SVG Adapter (Approved)

**GIVEN** arbitrary caller SVG and data-icon selectors cannot require StyleX markers without altering the shipped composition contract.
**WHEN** asked to choose scoped adapter or new icon-slot API, the user approved a private scoped adapter.
**THEN** inventory SVG pointer/shrink/size and data-icon padding selectors in internal/pilot/adapter.css, scoped to private Button helper classes. Do not clone caller children or claim these selectors are StyleX. Browser comparison must verify the exception; no public promotion yet.

## DEC-012: Destructive Copy (Approved)

**GIVEN** full private catalog reveals 3.02:1 dark destructive Button copy using the fill token.
**WHEN** asked whether to extend the approved readable dark error token, the user approved.
**THEN** use private errorText for destructive Button foreground while retaining its fill, and assert the intentional parity exception. No generated/public change.

## DEC-011: Accessible Secondary Foreground (Approved)

**GIVEN** light secondary Button baseline uses #0a0a0a on #1a1a1a, measuring 1.13:1 in the full A/B fixture.
**WHEN** asked to preserve exact parity or correct private foreground, the user approved the private contrast correction.
**THEN** use existing near-white primary-foreground value for private light secondary text and assert the comparison exception. Generated/public source stays unchanged until pilot review.

## DEC-010: Accessible Error Copy (Approved)

**GIVEN** generated dark FieldError uses destructive fill as text, measuring 3.52:1 against the canonical background in the private browser fixture.
**WHEN** asked to choose exact baseline or the existing canonical destructive-text value, the user approved accessible text.
**THEN** use oklch(0.66 0.19 25.69) for private dark FieldError, retain light error color, and assert this explicit comparison exception. Generated/public source remains untouched.

## DEC-009: Internal Pilot (Approved)

**GIVEN** public theme/CSS evolution remains an explicit approval gate.
**WHEN** asked whether to implement a scoped internal pilot while preserving shipped exports and style.css, the user selected "Internal pilot (Recommended)" on 2026-09-08.
**THEN** implement Button, Field/Input and Dialog in private `internal/pilot/` first, over React/Base UI. Keep theme context and portal inheritance private. Promote into owned package source only after pilot review. Preserve string helper and caller override behavior; do not ship a new Theme or CSS entry implicitly.

## DEC-008: Execution And Effect Boundary (Approved)

**GIVEN** the user requested full-phase detail, TDD and persistent implementation, then confirmed "Sure, never replace React/Base UI".
**WHEN** implementing the plan.
**THEN** use the confirmed public/component, theme/context, packed-output, resource and RC seams; Effect belongs only at tooling/resource boundaries. React/Base UI retain state and interaction. Proceed through green slices; breaking API, release publication and consumer migration remain separately gated. See `phase-detail.md` for every wave's test-first handoff.

## DEC-001: Scope

**GIVEN** the user requested a detailed artifact plan spanning every component.
**WHEN** this document is published.
**THEN** it is planning approval only; implementation begins with the bounded pilot after design approval, not all 70 entries.

## DEC-002: Generated Ownership

**GIVEN** generated Shadcn source is CLI-owned and StyleX cannot replace every utility selector mechanically.
**WHEN** a family is converted.
**THEN** recommend owned presentation over the same primitive engine, leaving generated source untouched; no wrapping Tailwind and claiming completion. Await architecture approval.

## DEC-003: CSS Ownership

**GIVEN** current style.css globally changes font/reset/token and the Web sentinel shows it.
**WHEN** defining the candidate theme contract.
**THEN** recommend scoped component/theme style and an opt-in document/font baseline; preserve existing CSS behavior until its change is explicitly approved. Await export and Theme API approval.

## DEC-004: Context

**GIVEN** provider identity and DOM theme inheritance are independent.
**WHEN** promoting root/subpath or creating a portal.
**THEN** require one runtime family and matching themed portal scope; never infer interoperability from matching component names.

## DEC-005: Recharts

**GIVEN** mixed Web v2/package v3 composition renders no bars while a Web-only control does.
**WHEN** evaluating the chart wave.
**THEN** require a positive matching-engine control and separately reviewed dependency policy. StyleX alone is not considered a context fix.

## DEC-006: API Compatibility

**GIVEN** className/style/render and string-returning variant helpers have already shipped.
**WHEN** replacing CVA/Tailwind presentation.
**THEN** preserve tested public behavior or approve an explicit breaking contract; do not substitute raw StyleX objects for class strings.

## DEC-007: Honest Evidence

**GIVEN** catalog render, owned coverage and Web integration cover different risk.
**WHEN** a wave passes one gate.
**THEN** do not claim all-state, all-component, heap-leak, full application or registry compatibility from that isolated result.

## Approval Checklist

| Decision needed before implementation           | Recommendation                                                                     | Consequence if rejected                                                    |
| ----------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Owned component over unchanged generated source | Approve for pilot only                                                             | Explore a CLI-generated StyleX registry approach; no manual generated edit |
| First scope                                     | Button + Field/Input + Dialog, support Label/Separator                             | Re-plan dependency closure before coding                                   |
| Theme and portal surface                        | Explicit scoped boundary with caller theme choice                                  | Document whole-document ownership and reject mixed-theme/scoped claims     |
| CSS entry evolution                             | Opt-in isolated component/global/font separation with reviewed RC contract         | Keep global style; accept sentinel impact explicitly, not silently         |
| Caller override and helper policy               | Preserve shipped type/ref/render/string helper; document external utility conflict | Breaking change proposal and consumer audit required                       |
| Third-party adapter                             | Allow minimal scoped CSS with inventory                                            | Block engine family until slot API can express complete styling            |
| Recharts contract                               | Decide after positive/negative engine reproduction                                 | Chart remains unsupported for mixed composition; no false green            |
| Expansion beyond pilot                          | Explicit evidence review per wave                                                  | Stop at experiment and keep generated baseline                             |

No item in this table is represented as user-approved merely because the user requested an artifact.

# DEC-017: Private Descendant Adapter

User approved a narrowly scoped build-time CSS adapter for caller-owned SVG/link and engine-generated markup after measured Badge SVG mismatch: candidate 24px versus baseline 12px. Preserve caller composition; no runtime utility conversion, no implicit public promotion. Scope exception to `[data-pilot-theme]` and explicit data-slot/engine selector. Keep ordinary presentation in StyleX. Audit every selector and both load-order isolation before promotion. Initial Badge SVG correction passes the 16-case surface/icon runner; this does not prove every new adapter selector.

## DEC-018: Destructive Menu Text Contrast

Dark generated destructive menu text measured 3.52:1 on the popup background and fails WCAG AA normal text. Use the already approved private dark `errorText` token for destructive DropdownMenu/ContextMenu/Menubar copy, matching DEC-010/012 accessibility intent. This is an intentional color deviation, not visual parity. Fill and focus background remain unchanged.
