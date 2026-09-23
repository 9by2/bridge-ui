---
"@bridge/ui": patch
---

Documented the switch to a PR-based workflow in `AGENTS.md`: work now happens on a non-`main` branch merged via pull/merge request instead of direct pushes to `main`. Added explicit commit-title (`{{type}}({{detail}}): {{short-message}}`) and branch-name (`{{type}}/{{detail}}`) patterns. The automated release branch remains automation-owned. No runtime behavior changes; this changeset exists to exercise the PR-triggered release pipeline end to end.
