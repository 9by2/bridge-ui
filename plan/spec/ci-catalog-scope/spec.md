# Spec: CI Catalog Scope

**Spec ID:** `ci-catalog-scope`
**Proposal:** `ci-catalog-scope`
**Status:** superseded

## Summary

Defines the historical CI scope of the complete Bun.WebView catalog suite. Complete WebView execution is superseded by `local-webview-gate`; CI retains static catalog compilation.

## Requirements

### REQ-001: Single MR pipeline

When a branch has an open merge request, GitLab must create the merge-request pipeline and must not create a duplicate push pipeline for that commit.

**Acceptance:**

- [ ] Root workflow accepts merge-request pipelines before suppressing open-MR branch pipelines.

### REQ-002: Catalog eligibility

The catalog job must run only from a child pipeline for non-chore commits on an MR or the default branch.

**Acceptance:**

- [ ] Conventional `chore:` and `chore(scope):` titles skip the catalog job.
- [ ] Non-chore MR and default-branch commits retain the full catalog suite.

## Non-Goals

- Reducing or retrying individual catalog checks.
- Skipping source, coverage, package, or release verification.
