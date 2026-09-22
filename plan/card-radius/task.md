# Tasks: Card Radius

Implementation order matters - complete top to bottom.

## Setup

- [x] Define the Card radius contract and public seam.

## Core

- [x] Add a failing public-contract test for Card radius metadata.
- [x] Add the Card radius prop and matching compound-slot geometry.

## Integration

- [x] Add the radius options to the Card catalog example.

## Verification

- [x] Run targeted Card test, formatting, lint, and typecheck.
- [x] Run required package verification gates and Bun.WebView catalog verification.
- [x] All specs in `spec/` reviewed against implementation.
- [ ] Archive proposal per plan/PROPOSAL.md.

## Blocker

- [ ] `bun catalog:build` size validation remains blocked by existing oversized `three` and catalog vendor chunks; tracked separately in `plan/catalog-bundle-splitting/`.
