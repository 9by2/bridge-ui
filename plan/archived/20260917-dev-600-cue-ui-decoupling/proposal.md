# DEV-600 Cue UI Decoupling

**Proposal:** `dev-600-cue-ui-decoupling`
**Status:** in-progress
**Phase:** [ADHD foundation first](../../ADHD.md#foundation-first)

## Problem

Cue contains the company’s most mature component recipes for geometry, padding, spacing, typography, responsive behavior, and accessibility, while `@bridge/ui` must become the private reusable presentation package. DEV-600 establishes the Cue-derived package foundation without moving Cue application code or product language into the package.

## Scope

### In scope

- Record Cue component recipes as the canonical visual and accessibility baseline for package-owned StyleX presentation.
- Remove the global square-radius reset and establish semantic tokens with light/white, Cue dark, and a future-theme layer that preserves DOM and geometry.
- Define Theme and Sonner package authority, Calendar focus/date behavior, and migration-critical Button `xl`, Tabs link, Select unstyled, and Dialog contracts.
- Define source ownership, export policy, public test seams, catalog evidence, and branded reusable components, including TicketCard, TicketCover, Receipt, StatusStamp, and related ticket-named presentation.
- Plan phased TDD implementation through all ADHD foundation gates.

### Out of scope

- Any Bridge Web, Cue, or other consumer import migration, deletion, route, container, query, authorization, DTO, workflow, or translation change.
- Product copy, product i18n, consumer theme policy, release publication, and private-registry credential setup.
- Editing generated Shadcn source or prior active/archived plan files.

## Success Criteria

- [x] `@bridge/ui` owns reusable StyleX presentation and a11y mechanics without importing consumer code or any product i18n (`test/component/dev-600-boundary.test.tsx`, `test/internal/source-boundary.test.ts`; zero `@cue/web`/`@bridge/web`/i18n imports anywhere in `app/`, `internal/catalog/example/`, `cmd/`).
- [x] Semantic color layers support white/light, Cue dark, and a future theme against identical DOM and geometry contracts (`themeMode` has four modes: `light`, `dark`, `cue`, `future`; `test/component/dev-600-boundary.test.tsx` proves identical DOM/slot structure across all four; `test/browser/theme-parity.spec.ts` proves identical non-color computed geometry in a real browser).
- [x] Public component APIs, exports, test seams, catalog states, and packaged client/SSR contracts are specified before implementation (`spec/ui-centralization/spec.md`, `design.md` public test seams table) and are now proven: `bun cmd/verify-package.ts` verifies 125 installed public entries with declaration checking plus a clean Vite client and SSR build.
- [x] The implementation sequence preserves every ADHD foundation gate before consumer migration is considered. Consumer migration remains untouched; DEV-600 stayed scoped to `app/`, `internal/catalog/`, `cmd/`, and `test/`.

## Specs

| Spec              | Path                             | Summary                                                                          |
| ----------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| ui-centralization | `spec/ui-centralization/spec.md` | Package ownership, theme, component, export, test-seam, and acceptance contract. |

## References

- [DEV-600 approved artifact](https://artifact.9by2.workers.dev/artifact/01a0aea5-656b-751a-a141-16e28eef4663/revision/01a0aebb-340a-7468-9224-6aa93605aadc/)
- [ADHD foundation contract](../../ADHD.md)
- [StyleX public promotion decisions](../stylex-public-promotion/decision.md)
