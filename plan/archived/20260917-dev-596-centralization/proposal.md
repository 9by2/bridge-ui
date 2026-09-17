# DEV-596 Component Centralization

**Proposal:** `dev-596-centralization`
**Status:** done
**Phase:** [ADHD foundation and build order](../../ADHD.md#foundation-first)

## Problem

The StyleX package foundation already owns the generated-compatible component catalog and a generic Page composition, but Bridge Web still owns one missing generic timeline primitive plus reusable page toolbar, data-state, and table-frame presentation. Those contracts must be centralized without moving Bridge Web route, data, permission, translation, density policy, or retry behavior into `@bridge/ui`.

## Scope

### In scope

- Add a package-owned StyleX timeline compound component based on the Bridge Web presentation contract.
- Extend the package Page composition with a generic toolbar slot.
- Add generic controlled DataState and TableFrame presentation components.
- Add root and stable subpath exports, catalog examples, package checks, and consumer-independent documentation.
- Record why Bridge Web density policy, default copy, icons, retry behavior, and form actions stay in the application.

### Out of scope

- Bridge Web import migration or local facade replacement; tracked by DEV-597.
- Application query, mutation, route, permission, i18n, DTO, or domain state.
- Private registry publication credentials or merging the automation-owned release branch.
- Reworking already-promoted StyleX primitive families.

## Success Criteria

- [x] New source has no consumer application import or product-domain contract.
- [x] Timeline, toolbar, data state, and table frame expose semantic slots and caller-controlled content.
- [x] Light, dark, mobile, long/Thai copy, horizontal overflow, error semantics, and reduced motion are represented in catalog or automated checks.
- [x] Root, direct, declaration, packed client, and SSR package contracts resolve.
- [x] Runtime and brand coverage gates remain satisfied.
- [x] Full local foundation validation required by ADHD passes, except external private-registry publication when credentials are unavailable.
- [x] A Changeset records the package feature.

## Specs

| Spec                  | Path                                 | Summary                                                                       |
| --------------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| reusable-presentation | `spec/reusable-presentation/spec.md` | Consumer-independent timeline, page toolbar, data state, and table frame API. |

## References

- [DEV-596 artifact revision](https://artifact.9by2.workers.dev/artifact/01a0ae78-a028-77a4-b472-ad2fbfbe12cd/revision/01a0aea3-4436-755b-8b7b-fd43f5e194d6/)
- Bridge Web `app/component/shadcn/timeline-steps.tsx`
- Bridge Web `app/component/studio/page.tsx`
- Existing package `app/component/brand/stylex/page.tsx`
