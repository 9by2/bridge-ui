# Spec: RC Release Promotion

**Spec ID:** `rc-release-promotion`
**Proposal:** `rc-release-promotion`
**Status:** accepted
**Superseded by:** [Stable release](../stable-release/spec.md). Historical RC/promotion contract only.

## Summary

`main` carries permanent Changesets pre-release mode. Every release-prep MR merge on `main`
auto-publishes an RC under the `next` npm dist-tag and auto-creates its RC git tag, unattended —
identical mechanics to today's stable flow, just always landing on `x.y.z-rc.N`. A new manual
`promote` GitLab CI job, exposed on every protected-`main` pipeline, lets a human explicitly
promote the current RC to stable under `latest` with its own `vx.y.z` git tag, without rebuilding
or re-verifying — it republishes the exact already-verified RC artifact.

## Requirements

### REQ-001 Permanent RC pre-mode

`main` has `.changeset/pre.json` committed with `mode: "pre"`, `tag: "rc"`. Every
`bun changeset version` run (via the existing release-prep MR flow) produces `x.y.z-rc.N`.

**Acceptance:**

- [ ] `.changeset/pre.json` exists at repo root with `mode: "pre"` and `tag: "rc"`.
- [ ] A release-prep MR merged after this change bumps to `x.y.z-rc.N`, not a stable `x.y.z`.
- [ ] Existing `release-fast-path` skip rule (`chore: version package( \(rc\))?`) still matches the
      resulting commit title — no change needed to that rule.
- [ ] Existing `cmd/publish-package.ts` channel routing (`-rc.` → `next`, else → `latest`) requires
      no code change — it already produces the correct behavior once every `main` version is an RC.

### REQ-002 Manual promote job

A new `promote` job in `deployment/.gitlab-ci.yml`, `stage: deploy`, gated on
`$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true"`, `when: manual`.

**Acceptance:**

- [ ] Job appears (but does not auto-run) on every protected-`main` pipeline.
- [ ] Running it when the current commit's `package.json` version is `x.y.z-rc.N` publishes
      `x.y.z` under `latest` and creates+pushes tag `vx.y.z`.
- [ ] Running it when the current commit's version is not an RC (`x.y.z`, no `-rc.` suffix) fails
      with "No RC version to promote" and publishes nothing.
- [ ] Running it when the RC version is not yet published under `next` fails with "RC version is
      not published yet; nothing to promote" and publishes nothing.
- [ ] Running it a second time after a successful promotion is a safe no-op (tag and publish both
      already exist).
- [ ] `resource_group: package-release` (shared with `release`) serializes concurrent runs.

### REQ-003 No change to pre-merge verification or existing release job

**Acceptance:**

- [ ] `source`, `coverage`, `catalog` job rules are unmodified by this spec.
- [ ] `release` job rule and script are unmodified by this spec.
- [ ] The release MR's own `merge_request_event` pipeline still runs full verification before merge,
      per `plan/spec/release-fast-path/spec.md` REQ-002 — unaffected by pre-mode being permanent.

### REQ-004 Promote prepares a stable release MR

`promote` runs `changeset pre exit`, `changeset version`, `changeset pre enter rc` on the current `main`, pushes `changeset-release/stable`, and creates or updates `Release @bridge/ui x.y.z (stable)`. Merging it publishes `x.y.z` under `latest` through the `release` job and tags `vx.y.z`. It never publishes directly and never pushes `main`.

**Acceptance:**

- [x] Stable includes every pending changeset, whether RCs were cut, skipped or never cut.
- [x] An existing open stable MR is updated, not duplicated.
- [x] No pending changeset → "No pending changeset; nothing to promote", no push.
- [x] Computed stable already published → fails "Stable x.y.z is already published; repair .changeset/pre.json base version", no push.
- [x] After merge, the next RC is numbered above the new stable.

### REQ-005 Skippable RC and stable

**Acceptance:**

- [x] Unmerged RC MRs lose nothing; their changesets stay pending.
- [x] Closing the stable MR skips that stable; the next promote rebuilds it from current `main`.

## Schema / API

```json
// .changeset/pre.json
{
  "mode": "pre",
  "tag": "rc",
  "initialVersions": { "@bridge/ui": "0.8.1" },
  "changesets": []
}
```

```yaml
# deployment/.gitlab-ci.yml
promote:
  stage: deploy
  resource_group: package-release
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true"'
      when: manual
  script:
    - test -n "$GITLAB_TOKEN"
    - bun run build
    - bun cmd/promote-release.ts
```

## Examples

### Example: promote an RC after it publishes

**Input:** `main` HEAD `package.json` version is `0.9.0-rc.2`, already published under `next`.
Human clicks ▶ on `promote`.

**Output:** `0.9.0` published under `latest`, tag `v0.9.0` created and pushed. `next` still points
at `0.9.0-rc.2` (untouched).

### Example: promote clicked on a non-RC commit

**Input:** `main` HEAD `package.json` version is `0.8.1` (a prior stable release, `.changeset/pre.json`
temporarily absent from a manual test).

**Output:** job fails: "No RC version to promote". No publish, no tag.

### Example: promote clicked before RC publish job finished

**Input:** `main` HEAD version is `0.9.0-rc.2`, but the `release` job that should have published it
is still running / failed.

**Output:** job fails: "RC version is not published yet; nothing to promote".

## Non-Goals

- A `develop` branch or `develop → main` promote-MR — superseded by DEC-001/DEC-002 in
  `plan/rc-release-promotion/decision.md`.
- Access control restricting who can click `promote` — deferred.
- Changing the RC publish job's own mechanics — unchanged, already correct.
