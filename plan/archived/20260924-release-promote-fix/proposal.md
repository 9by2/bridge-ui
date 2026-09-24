# Release Promote Fix

**Proposal:** `release-promote-fix`
**Status:** done
**Amends:** [rc-release-promotion](../spec/rc-release-promotion/spec.md)

## Problem

On 2026-09-24 `promote` published `0.9.0` from `0.9.0-rc.0`, but nothing moved the Changesets pre-release base. `.changeset/pre.json` kept `initialVersions: 0.8.1` and the shipped `color-picker` changeset stayed pending, so every later RC was `0.9.0-rc.N`. The next promote computed `0.9.0` again, found it published, and exited green without releasing rate-card, typography Thai, or !35.

## Scope

### In scope

- Promote runs the Changesets stable flow (pre exit → version → pre enter rc) and opens a stable release MR.
- RC and stable are both skippable.
- Fail loudly when the computed stable already exists.
- One-time repair: base `0.9.0`, drop shipped `color-picker` changeset, `package.json` `0.9.0`.

### Out of scope

- Promoting an arbitrary older RC while `main` has moved on.
- Direct push to protected `main` (DEC-001).

## Success Criteria

- [x] Next RC from `main` is `0.10.0-rc.0`; promote from `main` produces `0.10.0` with every pending changeset.
- [x] Skipped RC and skipped stable proven against the real Changesets engine.
- [x] Promote never reports success without a new stable.
