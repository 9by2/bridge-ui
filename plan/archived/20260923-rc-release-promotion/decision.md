# Decisions: RC Release Promotion

| ID      | Title                                                                                      | Status   |
| ------- | ------------------------------------------------------------------------------------------ | -------- |
| DEC-001 | Permanent RC pre-mode lives on `main`, no `develop` branch                                 | accepted |
| DEC-002 | Promotion is a manual tag-gated CI job, not a promote-MR                                   | accepted |
| DEC-003 | AGENTS.md workflow-line update is a follow-up the user applies, not this proposal's output | accepted |

---

### DEC-001: Permanent RC pre-mode lives on `main`, no `develop` branch

**GIVEN** an earlier `/create-artifact` draft proposed a `develop` branch carrying permanent RC
pre-mode with a `develop → main` promote-MR, but no `develop` branch was ever created and the
`chore/pr-workflow-rule` MR (!20) already proved feature MRs merge directly into `main`
**WHEN** designing the RC step for this repo's actual current workflow
**THEN** `.changeset/pre.json` (permanent pre-mode) is committed on `main` itself. No new branch is
introduced. This supersedes the `develop`-branch language in the `create-artifact` output; that
artifact remains a valid _alternative_ design but is not what gets implemented here.

---

### DEC-002: Promotion is a manual tag-gated CI job, not a promote-MR

**GIVEN** the user's originally confirmed answer (prior turn) was "CI auto-creates an RC tag every
publish; separate manual job promotes it" — explicitly the manual-CI-job option, not the
develop→main-MR option that the artifact later documented
**WHEN** reconciling the artifact's drift with the user's actual locked-in choice
**THEN** promotion is a new `promote` deploy-stage job, `when: manual`, gated on
`$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true"` (same gate as
`release`), triggered by a human clicking ▶ in GitLab on the current protected-`main` pipeline. It
reads the current RC version from `package.json`, not from a separately pushed tag — GitLab's
`when: manual` semantics do not support "gate on a future tag push" as a rule condition, so the
existing HEAD-of-`main` commit (already at `x.y.z-rc.N` after the RC publish job ran) is the source
of truth for what gets promoted.

---

### DEC-003: AGENTS.md workflow-line update is a follow-up the user applies, not this proposal's output

**GIVEN** `AGENTS.md:3` states "AGENTS MUST NEVER EDIT THIS FILE, EVEN USER ASK FOR" and the user
asked "tell me what to change the workflow guideline in AGENTS.md"
**WHEN** this proposal's `task.md` reaches its documentation step
**THEN** the proposal's final task produces the exact suggested `AGENTS.md` line text as a
deliverable to the user (in the handoff message, not as a file edit), and the user applies it
themselves. No commit in this proposal touches `AGENTS.md`.

---

<!-- Add DEC-004+ as decisions are made -->
