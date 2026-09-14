# Catalog CI Stability

## Problem

CI job 247106 failed three readiness assertions while 428 passed. The histogram completed after its assertion deadline; control navigation left module requests unfinished. An isolated Linux repeat passed 30/30, so a local pass alone cannot establish stability.

## Scope

Inspect the CI trace, reproduce under constrained Linux execution, fix the demonstrated cause, and retain failure evidence. Preserve every accessibility, interaction, visual, and memory assertion required by [ADHD.md](../../ADHD.md).

## Success

The complete catalog gate passes under constrained Linux execution without retry or increased assertion timeout. Record the exact environment and distinguish local proof from remote CI proof.

## Non-Goal

No package API, release version, or consumer migration change.
