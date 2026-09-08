# Decision And Approval Record

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
