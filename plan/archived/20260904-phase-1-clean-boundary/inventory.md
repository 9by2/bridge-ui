# Phase 1 Source Inventory

## Baseline

| Measure                                             | Value                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| Recorded                                            | 2026-09-04                                                         |
| Files under `app/`                                  | 114                                                                |
| TypeScript modules under `app/`                     | 111                                                                |
| Generated Shadcn modules                            | 63                                                                 |
| Modules importing `@cue/web`                        | 22                                                                 |
| Hand-authored modules importing `@bridge/ui/app/**` | 24                                                                 |
| Runtime dependencies                                | 30                                                                 |
| Full lint                                           | 113 errors, 1 generated warning                                    |
| Full typecheck                                      | Failed in copied application source and generated Shadcn source    |
| Shadcn tree hash                                    | `455035fe33e636044951940a7ee4a8c7a2d0d1dceb7bdbf41e39b5f0637fe265` |

## Disposition Rule

- `keep unchanged`: generated Shadcn source.
- `retain`: support required by generated primitives or canonical base style.
- `delete`: copied source with no approved package contract, application responsibility, product copy, consumer dependency, or product-specific composition.
- A future proposal may restore a deleted presentation pattern with consumer evidence and a tested reusable contract. Git history remains the source reference.

## Generated Shadcn

All 63 modules under `app/component/shadcn/` are `keep unchanged`. They are generated primitives and are excluded from hand-authored source lint policy.

## Package Support

| Module                    | Disposition      | Rationale                                                                               |
| ------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `app/hook/use-mobile.ts`  | keep unchanged   | Shadcn-generated support imported by generated sidebar                                  |
| `app/style/global.css`    | retain and clean | Canonical primitive theme; remove copied product-specific markdown and paid-state style |
| `app/component/.DS_Store` | delete           | Operating-system metadata                                                               |

## Copied Global Source

Every module below is `delete`. Generic-looking names do not establish an approved reusable contract, and retaining them would require speculative API design before the package export phase.

| Module                                     | Primary boundary issue                     |
| ------------------------------------------ | ------------------------------------------ |
| `agreement-document.component.tsx`         | Product agreement composition and i18n     |
| `date-time-field.component.tsx`            | Cue date contract and i18n                 |
| `date-time-range-field.component.tsx`      | Cue date contract and i18n                 |
| `detail-item.component.tsx`                | Unapproved copied composition              |
| `dropzone.component.tsx`                   | Product i18n and unapproved broad contract |
| `error.component.tsx`                      | Router and product i18n                    |
| `event-cta.component.tsx`                  | Product event composition                  |
| `header.component.tsx`                     | Application router                         |
| `icon.component.tsx`                       | Unapproved copied composition              |
| `lazy.component.tsx`                       | Unapproved copied utility component        |
| `loading.component.tsx`                    | Unapproved copied composition              |
| `location-permission-dialog.component.tsx` | Product permission workflow and i18n       |
| `logo.component.tsx`                       | Product branding                           |
| `markdown-editor-embed-dialog.tsx`         | Cue social contract and i18n               |
| `markdown-editor-embed-directive.tsx`      | Cue social contract                        |
| `markdown-editor-image-dialog.tsx`         | Product editor workflow and i18n           |
| `markdown-editor.component.css`            | Copied editor-specific style               |
| `markdown-editor.component.tsx`            | Product editor workflow and i18n           |
| `markdown-preview.component.tsx`           | Cue markdown and social contracts          |
| `notfound.component.tsx`                   | Application route and i18n                 |
| `order-receipt.component.tsx`              | Product order composition                  |
| `page-header.component.tsx`                | Unapproved copied composition              |
| `product-item.component.tsx`               | Product domain composition                 |
| `promptpay-qr-code.component.tsx`          | Payment domain logic and i18n              |
| `purchase-cta.component.tsx`               | Product purchase behavior                  |
| `responsive-image.component.tsx`           | Unapproved copied utility contract         |
| `route-moved-notice.component.tsx`         | Application route behavior                 |
| `setting.component.tsx`                    | Unapproved copied composition              |
| `share-button.component.tsx`               | Product share behavior                     |
| `social-embed.component.tsx`               | Cue social contract and i18n               |
| `status-badge.component.tsx`               | Unapproved domain-status abstraction       |
| `sticky-alert.component.tsx`               | Unapproved copied composition              |
| `success-burst.component.tsx`              | Product paid-state animation               |
| `ticket-cover.component.tsx`               | Ticket domain composition                  |
| `ticket-guard.component.tsx`               | Ticket workflow                            |
| `ticket-ui-card.component.tsx`             | Ticket domain and i18n                     |
| `time-select.component.tsx`                | Unapproved copied input contract           |
| `typography.component.tsx`                 | Unapproved wrapper contract                |
| `voided-ticket-stamp.component.tsx`        | Ticket domain and i18n                     |

## Studio Source

| Module                                 | Disposition | Rationale                                                    |
| -------------------------------------- | ----------- | ------------------------------------------------------------ |
| `auth-provider-icon.component.tsx`     | delete      | Consumer auth config and i18n                                |
| `financial-report-table.component.tsx` | delete      | Financial DTO, mapper, timezone, status, and i18n            |
| `studio-order-table.tsx`               | delete      | Studio DTO and i18n                                          |
| `studio-route-error.component.tsx`     | delete      | Studio authorization and router                              |
| `studio-status-pill.tsx`               | delete      | Studio domain status                                         |
| `studio-table-pagination.tsx`          | delete      | Studio container composition                                 |
| `studio-talent-avatar.tsx`             | delete      | Studio domain presentation without approved package contract |

## Ticket Source

| Module                                 | Disposition | Rationale                                 |
| -------------------------------------- | ----------- | ----------------------------------------- |
| `ticket-checkin-scanner.component.tsx` | delete      | Check-in workflow, DTO, scanner, and i18n |
| `ticket-checkin-stats.component.tsx`   | delete      | Check-in domain and i18n                  |

## Private Preview

| Module           | Disposition | Rationale                                                     |
| ---------------- | ----------- | ------------------------------------------------------------- |
| `cmd/build.ts`   | delete      | HTML preview build is obsolete; Phase 2 creates library build |
| `cmd/preview.ts` | delete      | References missing example and contains template API routes   |

## Generated Type Debt

The baseline full typecheck also reports generated compatibility errors in `dialog.tsx`, `menubar.tsx`, and `sonner.tsx`. Phase 1 does not manually patch them. A later Shadcn CLI refresh or package-foundation phase must resolve them before the full foundation quality gate passes.

## Final State

| Measure                               | Value                                                              |
| ------------------------------------- | ------------------------------------------------------------------ |
| Files under `app/`                    | 65                                                                 |
| Generated Shadcn modules              | 63                                                                 |
| Generated Shadcn support modules      | 1                                                                  |
| Canonical style files                 | 1                                                                  |
| Production consumer imports           | 0                                                                  |
| Hand-authored private package imports | 0                                                                  |
| Runtime dependencies                  | 20                                                                 |
| Boundary test                         | 4 passed                                                           |
| Lint                                  | 0 errors, 1 generated warning                                      |
| Phase 1 typecheck                     | passed                                                             |
| Shadcn tree hash                      | `455035fe33e636044951940a7ee4a8c7a2d0d1dceb7bdbf41e39b5f0637fe265` |

`cn` remains a direct generated-source dependency. React DOM remains unchanged with React until Phase 2 finalizes both as package peer dependencies.
