# Tasks: RC Release Promotion

Implementation order matters — complete top to bottom.

## Setup

- [x] Confirm `.changeset/pre.json` schema against `@changesets/pre`'s `enterPre`/`exitPre` output
      (already exercised in `test/internal/changeset.test.ts`) — use `{"mode":"pre","tag":"rc","initialVersions":{"@bridge/ui":"<current version>"},"changesets":[]}`.
- [x] Confirm `CI_SERVER_HOST` and `CI_PROJECT_PATH` are available GitLab predefined variables (used
      for the promote push URL) — check GitLab CI predefined-variables docs or an existing pipeline's
      job log.

## Core

- [x] Commit `.changeset/pre.json` with `tag: "rc"`, `initialVersions` set to the current
      `package.json` version, empty `changesets` array.
- [x] Write `cmd/promote-release.ts` per `design.md`'s example code — extract shared temp-directory
      publish/verify logic with `cmd/publish-package.ts` into a small shared helper only if doing so
      doesn't reduce either file's independent testability; otherwise duplicate deliberately (both
      files stay short and test-isolated today).
- [x] Add `promote` job to `deployment/.gitlab-ci.yml` after `release:`, per `design.md`.
- [x] Add `release:promote` script to `package.json` (`bun cmd/promote-release.ts`) mirroring
      `release:publish`'s pattern.

## Integration

- [x] Write `test/internal/promotion.test.ts` mirroring `test/internal/publication.test.ts`'s
      dependency-injection pattern: cover new-promotion, already-stable-published, RC-not-published,
      no-RC-on-current-commit, and tag-already-exists scenarios.
- [x] Extend `test/internal/release.test.ts` with an assertion for the new `promote` job's rule
      (`when: manual`, same protected-branch gate as `release`) and resource group.
- [x] Run `bun test test/internal/release.test.ts test/internal/promotion.test.ts` — verify both
      pass and no existing test in either file regressed.

## Verification

- [x] `bun fmt --check`
- [x] `bun lint`
- [x] `bun typecheck`
- [x] `bun test` (full suite)
- [x] `bun coverage:runtime` — `cmd/promote-release.ts` is `cmd/` scope, confirm it's covered by the
      same command-coverage expectation as `cmd/publish-package.ts` (check
      `plan/spec/runtime-coverage/spec.md` for whether `cmd/` is in or out of the runtime floor).
      Confirmed out of scope (`coverage:runtime` measures `app/**` and `shared/**` only); `cmd/`
      files are verified via `bun test`, matching `cmd/publish-package.ts`'s existing precedent.
- [x] Amend `plan/spec/gitlab-release/spec.md` to document the RC-then-promote two-step contract,
      superseding its current "RC under next and stable under latest" single-paragraph language.
- [x] Amend `plan/spec/changeset-release/spec.md` if its "Protected publication" requirement still
      describes single-step stable publication. Reviewed — that spec is a point-in-time record of
      the historical 0.3.0 promotion, not a general contract; left unamended.
- [x] Create `plan/spec/rc-release-promotion/spec.md` (this proposal's own spec) with full
      requirements/acceptance per `templates.md`.
- [x] Produce the exact `AGENTS.md` line-replacement text for the user to apply themselves (per
      DEC-003) — do not edit `AGENTS.md`.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal per plan/PROPOSAL.md.
