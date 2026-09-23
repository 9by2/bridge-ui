# RC Release Promotion

**Proposal:** `rc-release-promotion`
**Status:** in-progress
**Phase:** amends `plan/spec/gitlab-release/spec.md`, `plan/spec/changeset-release/spec.md`, `plan/spec/release-fast-path/spec.md`

## Problem

Today, every feature MR merged to `main` that carries a changeset ends up published straight to
`latest` unattended the moment its release-prep MR (`changeset-release/main`) is merged — confirmed
by `@bridge/ui@0.8.1` going live the moment MR !21 merged, with no RC step and no separate human
confirmation gate. The user wants:

1. `main` to carry a permanent Changesets pre-release state, so every release-prep MR merge bumps to
   an RC (`x.y.z-rc.N`) and auto-publishes it under the `next` npm dist-tag with an auto-created git
   tag — same unattended mechanics as today, just always landing on an RC version instead of stable.
2. A separate, explicit, human-triggered step to promote the current RC to stable (`latest`) — a new
   `promote` deploy job, `when: manual`, gated on a tag matching the current RC version, that someone
   clicks ▶ to run in GitLab once they've decided the RC is good.

No new branch (`develop`) is introduced — feature MRs already merge directly into `main` (confirmed:
MR !20, !21 both targeted `main`), so pre-release mode lives on `main` itself.

## Scope

### In scope

- Commit `.changeset/pre.json` enabling Changesets pre-release mode (`tag: "rc"`) so every
  `changeset version` run on `main` produces `x.y.z-rc.N` instead of a stable bump.
- Add a new `promote` job to `deployment/.gitlab-ci.yml`, `stage: deploy`, `when: manual`, triggered
  by pushing a tag with no `-rc.` suffix that matches the current RC's base version (e.g. RC is
  `0.9.0-rc.2`, someone pushes tag `v0.9.0`).
- A new `cmd/promote-release.ts` script: takes the currently-published RC `dist/` (or rebuilds from
  the RC's source commit), republishes the exact same artifact under `latest`, and confirms the
  stable tag matches.
- Update `test/internal/release.test.ts` with assertions for the new job/script.
- Amend `plan/spec/gitlab-release/spec.md` and `plan/spec/changeset-release/spec.md` to document the
  permanent-RC + manual-promote contract, superseding the "stable under latest" single-step language.

### Out of scope

- Any `develop` branch — confirmed unnecessary; feature MRs stay targeted at `main`.
- Changing `source`/`coverage`/`catalog` verify jobs — unaffected by this proposal.
- Changing `cmd/publish-package.ts`'s existing RC-vs-stable channel routing logic (`-rc.` in version
  string → `next`, else → `latest`) — still correct, just now driven by an explicit promote tag
  instead of a version-string coincidence.
- Access control on who can click the manual `promote` job — deferred; GitLab's default (any member
  who can run pipelines) applies for now.
- `AGENTS.md` content — the agent is blocked from editing it; the user updates the workflow line
  themselves based on this proposal's `README.md`/command summary once accepted.

## Success Criteria

- [ ] Merging a release-prep MR on `main` with a pending changeset produces `x.y.z-rc.N`, publishes
      under `next`, and auto-creates tag `vx.y.z-rc.N` — unattended, same as today's stable flow but
      landing on RC.
- [ ] Pushing tag `vx.y.z` (no `-rc.` suffix) when the current `next` RC is `x.y.z-rc.N` exposes a
      manual `promote` job in that tag's pipeline; running it republishes the same artifact under
      `latest` without rebuilding from a different commit.
- [ ] Pushing a stable tag that does not match any published RC's base version fails the `promote`
      job with a clear error, publishing nothing.
- [ ] `test/internal/release.test.ts` and a new promotion test cover both paths.
- [ ] `plan/spec/gitlab-release/spec.md` documents the two-step RC → promote contract.

## Specs

| Spec                   | Path                                | Summary                                                                            |
| ---------------------- | ----------------------------------- | ---------------------------------------------------------------------------------- |
| `rc-release-promotion` | `spec/rc-release-promotion/spec.md` | Permanent RC pre-mode on `main` plus a manual tag-triggered promote-to-stable job. |

## References

- `plan/spec/gitlab-release/spec.md`
- `plan/spec/changeset-release/spec.md`
- `plan/spec/release-fast-path/spec.md`
- User's confirmed design answers: main stays permanent RC pre-mode; promotion is a manual CI job
  gated on a tag (not a `develop → main` MR, despite an earlier artifact draft documenting the latter).
