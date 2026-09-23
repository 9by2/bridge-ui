# React Doctor Warning Cleanup

**Status:** active

## Problem

Full React Doctor 0.9.14 scan reports 138 warnings. Previous proposals fixed errors and a small number of confirmed warnings, but the requested full cleanup remains incomplete. See [ADHD.md](../../ADHD.md) for source ownership.

## Scope

Resolve warnings in owned code and private tooling without hiding diagnostics, breaking package contracts, or manually editing generated Shadcn files. Classify warnings that require regeneration or are generated artifacts.

## Success

- Reduce full-scan warnings to zero where technically possible without violating source ownership.
- Verify catalog, package, runtime and browser contracts after changes.
- Keep unrelated concurrent changes untouched.

## Progress

Full scan (React Doctor 0.9.14): 138 to 78 warnings, zero errors, no skipped checks. Context values, formatter allocation, inventory lookups, catalog lazy initialization, accessibility labels, and targeted verification tooling improved. The current-page breadcrumb no longer presents a dead link. Owned Button, WizardStepIndicator, and UploadViewer complexity was reduced without changing their public contracts. Remaining findings include 20 cross-file duplicate trees (mostly deliberate owned/pilot or vendored example mirrors), 14 generated Shadcn findings requiring CLI regeneration, 9 ordered browser verification loops, and 3 warnings in ignored build/report bundles. Other findings include index keys for position-addressed data, carousel callback effects required by its public API, and presentation complexity advisories. A restricted same-origin preview iframe failed the browser render test; the working iframe was restored. The upload preview extraction did not resolve its warning and was reverted. The proposal remains active; no scanner warnings have been suppressed or generated sources hand-edited.
